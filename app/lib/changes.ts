/** Change requests: open, check, review, merge. Merging is an approval step governed by the SOD rules. */
import { prisma } from "./db";
import { audit } from "./audit";
import { applyEdit, diffTrees, mergeTrees, validateTree, type ConfigTree } from "./config";
import { replay, type ReplayInvoice, type ReplayResult } from "./replay";
import { authorizeApproval, type Principal } from "./sod";
import { commitOnBranch, createBranch, head, mergeBase, moveRef, nextRequestNumber, putCommit, treeAt, MAIN } from "./vcs";

export const REQUIRED_CHECKS = ["merge-clean", "config-loads", "impact"] as const;

export async function loadReplayInvoices(): Promise<ReplayInvoice[]> {
  const rows = await prisma.invoice.findMany({ include: { lines: { orderBy: { lineNo: "asc" } } }, orderBy: { number: "asc" } });
  return rows.map((r) => ({
    number: r.number, kind: r.kind, partner: r.partner, date: r.date.toISOString().slice(0, 10), state: r.state, currency: r.currency,
    lines: r.lines.map((l) => ({ lineNo: l.lineNo, quantity: l.quantity, priceUnitMinor: l.priceUnitMinor, taxCodes: l.taxCodes })),
    storedTaxMinor: r.taxMinor,
    configCommit: r.configCommit,
  }));
}

/** The trees every invoice was computed with, for the parity check. */
export async function treesForInvoices(invoices: ReplayInvoice[]): Promise<Record<string, ConfigTree>> {
  const out: Record<string, ConfigTree> = {};
  for (const h of new Set(invoices.map((i) => i.configCommit).filter((h): h is string => Boolean(h)))) out[h] = await treeAt(h);
  return out;
}

export async function referencedTaxCodes(openOnly = false): Promise<Set<string>> {
  const rows = await prisma.invoiceTax.findMany({ select: { taxCode: true, invoice: { select: { state: true } } } });
  return new Set(rows.filter((r) => !openOnly || r.invoice.state !== "paid").map((r) => r.taxCode));
}

/** Convenience for the UI and the agent: branch + edit + commit + open, in one call. */
export async function proposeEdit(opts: { branch: string; title: string; body?: string; edits: { path: string; value: unknown }[]; effectiveFrom?: string; actor: Principal }) {
  const { branch, title, body, edits, effectiveFrom, actor } = opts;
  const existing = await prisma.ref.findUnique({ where: { name: branch } });
  if (!existing) await createBranch(branch, MAIN, actor);
  let tree = await treeAt(await head(branch));
  for (const e of edits) tree = applyEdit(tree, e.path, e.value);
  const message = edits.map((e) => `${e.path} → ${JSON.stringify(e.value)}`).join("; ");
  await commitOnBranch(branch, tree, actor, message);
  return openRequest({ sourceRef: branch, title, body, effectiveFrom, actor });
}

export async function openRequest(opts: { sourceRef: string; targetRef?: string; title: string; body?: string; effectiveFrom?: string; actor: Principal }) {
  const targetRef = opts.targetRef ?? MAIN;
  const headHash = await head(opts.sourceRef);
  const baseHash = await head(targetRef);
  if (headHash === baseHash) throw new Error(`'${opts.sourceRef}' has no commits that '${targetRef}' does not already have`);
  const open = await prisma.changeRequest.findFirst({ where: { sourceRef: opts.sourceRef, targetRef, status: "open" } });
  if (open) throw new Error(`${open.number} is already open for '${opts.sourceRef}'`);
  const number = await nextRequestNumber();
  const cr = await prisma.changeRequest.create({ data: { number, title: opts.title.trim(), body: opts.body, sourceRef: opts.sourceRef, targetRef, headHash, baseHash, mergeBaseHash: await mergeBase(baseHash, headHash), effectiveFrom: opts.effectiveFrom ? new Date(opts.effectiveFrom) : null, openedBy: opts.actor.id } });
  await audit(opts.actor, "config.change_request_opened", "change_request", number, `${opts.actor.displayName} opened ${number}: ${cr.title}`, { source: opts.sourceRef, target: targetRef, head: headHash, base: baseHash });
  return cr;
}

/** The head moves if the branch got a new commit; approvals on the old head become stale. */
export async function refreshHead(number: string) {
  const cr = await prisma.changeRequest.findUniqueOrThrow({ where: { number } });
  if (cr.status !== "open") return cr;
  const current = await head(cr.sourceRef);
  const base = await head(cr.targetRef);
  if (current !== cr.headHash || base !== cr.baseHash) {
    return prisma.changeRequest.update({ where: { number }, data: { headHash: current, baseHash: base, mergeBaseHash: await mergeBase(base, current) } });
  }
  return cr;
}

export async function getRequest(number: string) {
  const cr = await refreshHead(number);
  const [baseTree, headTree, mergeBaseTree] = await Promise.all([treeAt(cr.baseHash), treeAt(cr.headHash), treeAt(cr.mergeBaseHash)]);
  const diff = diffTrees(mergeBaseTree, headTree); // three-dot diff: merge base → head
  const checks = await prisma.check.findMany({ where: { requestNumber: number }, orderBy: { id: "desc" } });
  const latest = new Map<string, (typeof checks)[number]>();
  for (const c of checks) if (c.headHash === cr.headHash && !latest.has(c.name)) latest.set(c.name, c);
  const reviews = await prisma.review.findMany({ where: { requestNumber: number }, orderBy: { id: "asc" } });
  const approvals = reviews.filter((r) => r.state === "approved");
  const currentApprovals = approvals.filter((r) => r.headHash === cr.headHash);
  const checksOk = REQUIRED_CHECKS.every((n) => latest.get(n)?.conclusion === "success");
  const mergeable = cr.status === "open" && checksOk && currentApprovals.length > 0;
  return {
    request: cr, diff, baseTree, headTree,
    checks: REQUIRED_CHECKS.map((n) => latest.get(n) ?? null),
    allChecks: checks,
    reviews: reviews.map((r) => ({ ...r, stale: r.state === "approved" && r.headHash !== cr.headHash })),
    mergeability: { mergeable, checksOk, approvals: currentApprovals.length, staleApprovals: approvals.length - currentApprovals.length, reasons: [
      ...(checksOk ? [] : ["not every required check has succeeded on the current head"]),
      ...(currentApprovals.length ? [] : ["no approval on the current head"]),
    ] },
  };
}

export async function runChecks(number: string, actor: Principal): Promise<{ checks: { name: string; conclusion: string; summary: string }[]; impact: ReplayResult | null }> {
  const cr = await refreshHead(number);
  if (cr.status !== "open") throw new Error(`${number} is ${cr.status}`);
  const [baseTree, headTree, mb] = await Promise.all([treeAt(cr.baseHash), treeAt(cr.headHash), treeAt(cr.mergeBaseHash)]);
  const results: { name: string; conclusion: string; summary: string; detail: object }[] = [];
  const merged = mergeTrees(mb, baseTree, headTree);
  results.push({ name: "merge-clean", conclusion: merged.clean ? "success" : "failure", summary: merged.clean ? `Merges cleanly into ${cr.targetRef}` : `${merged.conflicts.length} conflict(s) with ${cr.targetRef}`, detail: { conflicts: merged.conflicts, applied: merged.applied } });
  const problems = validateTree(merged.clean ? merged.tree : headTree, await referencedTaxCodes(true));
  results.push({ name: "config-loads", conclusion: problems.length ? "failure" : "success", summary: problems.length ? `${problems.length} problem(s): ${problems[0]}` : `Configuration loads: ${Object.keys(headTree.taxes).length} taxes valid, every referenced tax present and active`, detail: { problems } });
  const invoices = await loadReplayInvoices();
  const impact = replay(baseTree, headTree, invoices, await treesForInvoices(invoices));
  const removed = [...await referencedTaxCodes(true)].filter((c) => !headTree.taxes[c] || !headTree.taxes[c].active);
  const impactFailed = removed.length > 0;
  results.push({ name: "impact", conclusion: impactFailed ? "failure" : "success", summary: impactFailed ? `${impact.headline} Fails: tax ${removed.join(", ")} is still referenced by open invoices.` : impact.headline, detail: impact as unknown as object });
  for (const r of results) await prisma.check.create({ data: { requestNumber: number, headHash: cr.headHash, name: r.name, conclusion: r.conclusion, summary: r.summary, detail: r.detail } });
  await audit(actor, "config.checks_run", "change_request", number, `${actor.displayName} ran checks on ${number}: ${results.map((r) => `${r.name}=${r.conclusion}`).join(", ")}`, { head: cr.headHash });
  return { checks: results.map(({ name, conclusion, summary }) => ({ name, conclusion, summary })), impact };
}

export async function review(number: string, actor: Principal, state: "approved" | "changes_requested", note?: string) {
  const cr = await refreshHead(number);
  if (cr.status !== "open") throw new Error(`${number} is ${cr.status}`);
  const subject = { number, openedBy: cr.openedBy, touchesTax: true };
  if (state === "approved") {
    const decision = authorizeApproval(actor, subject);
    if (!decision.allowed) {
      const row = await prisma.review.create({ data: { requestNumber: number, headHash: cr.headHash, state: "blocked", actorId: actor.id, ruleId: decision.ruleId, note: decision.message } });
      await audit(actor, "config.approval_blocked", "change_request", number, `${actor.displayName} tried to approve ${number} and was refused by ${decision.ruleId}`, { rule: decision.ruleId, message: decision.message });
      return { blocked: true as const, decision, review: row };
    }
  }
  const row = await prisma.review.create({ data: { requestNumber: number, headHash: cr.headHash, state, actorId: actor.id, note } });
  await audit(actor, `config.review_${state}`, "change_request", number, `${actor.displayName} ${state === "approved" ? "approved" : "requested changes on"} ${number}`, { head: cr.headHash });
  return { blocked: false as const, review: row };
}

export async function merge(number: string, actor: Principal) {
  const detail = await getRequest(number);
  const cr = detail.request;
  if (cr.status !== "open") throw new Error(`${number} is ${cr.status}`);
  const decision = authorizeApproval(actor, { number, openedBy: cr.openedBy, touchesTax: true });
  if (!decision.allowed) {
    await prisma.review.create({ data: { requestNumber: number, headHash: cr.headHash, state: "blocked", actorId: actor.id, ruleId: decision.ruleId, note: decision.message } });
    await audit(actor, "config.merge_blocked", "change_request", number, `${actor.displayName} tried to merge ${number} and was refused by ${decision.ruleId}`, { rule: decision.ruleId, message: decision.message });
    return { merged: false as const, blocked: true as const, decision };
  }
  if (!detail.mergeability.mergeable) throw new Error(`${number} is not mergeable: ${detail.mergeability.reasons.join("; ")}`);
  const mb = await treeAt(cr.mergeBaseHash);
  const merged = mergeTrees(mb, detail.baseTree, detail.headTree);
  if (!merged.clean) throw new Error(`conflicts: ${merged.conflicts.join(", ")}`);
  const commit = await putCommit(merged.tree, [cr.baseHash, cr.headHash], actor, `Merge ${number}: ${cr.title}`);
  await moveRef(cr.targetRef, commit.hash, actor, `merge ${number}: ${cr.title}`);
  await prisma.changeRequest.update({ where: { number }, data: { status: "merged", mergedBy: actor.id, mergedAt: new Date() } });
  await audit(actor, "config.merged", "change_request", number, `${actor.displayName} merged ${number} into ${cr.targetRef}; ${cr.targetRef} is now ${commit.hash.slice(0, 12)}`, { commit: commit.hash });
  return { merged: true as const, blocked: false as const, commit: commit.hash };
}

export async function closeRequest(number: string, actor: Principal) {
  await prisma.changeRequest.update({ where: { number }, data: { status: "closed", closedAt: new Date() } });
  await audit(actor, "config.change_request_closed", "change_request", number, `${actor.displayName} closed ${number}`, {});
}
