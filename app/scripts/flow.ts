/** End-to-end governance flow against the seeded database, no UI: propose → checks → refusals → approve → merge → audit. */
import { PRINCIPALS, findPrincipal } from "../lib/sod";
import { proposeEdit, runChecks, review, merge, getRequest } from "../lib/changes";
import { verifyChain } from "../lib/audit";
import { head } from "../lib/vcs";
import { prisma } from "../lib/db";

const P = (id: string) => findPrincipal(id)!;
async function main() {
  console.log("principals:", PRINCIPALS.map((p) => p.id).join(", "));
  const before = await head("main");
  const cr = await proposeEdit({ branch: `flow/s15-${Date.now().toString(36)}`, title: "Raise Sale VAT 15% to 16%", edits: [{ path: "taxes.S15.amount", value: "0.16" }], effectiveFrom: "2026-10-01", actor: P("tam.tran") });
  console.log("opened", cr.number, "by", cr.openedBy);
  const { checks, impact } = await runChecks(cr.number, P("tam.tran"));
  for (const c of checks) console.log(`  check ${c.name}: ${c.conclusion} — ${c.summary}`);
  console.log("  impact:", impact?.headline, `(${impact?.durationMs} ms; parity mismatches: ${impact?.parity.length})`);
  for (const t of impact?.byTax ?? []) console.log(`    ${t.taxCode} ${t.invoices} invoices ${t.baseDisplay} -> ${t.headDisplay} delta ${t.deltaDisplay}`);
  for (const m of (impact?.movers ?? []).slice(0, 3)) console.log(`    ${m.number} ${m.partner} ${m.deltaDisplay}`);
  for (const id of ["claude", "tam.tran", "maya.chen"]) {
    const r = await review(cr.number, P(id), "approved");
    console.log(`  ${id} approve ->`, r.blocked ? `blocked ${r.decision.ruleId}: ${r.decision.message}` : "approved");
  }
  const m1 = await merge(cr.number, P("claude"));
  console.log("  claude merge ->", m1.blocked ? `blocked ${m1.decision?.ruleId}` : "merged?!");
  const ok = await review(cr.number, P("priya.raman"), "approved");
  console.log("  priya approve ->", ok.blocked ? "blocked" : "approved");
  const d = await getRequest(cr.number);
  console.log("  mergeable:", d.mergeability);
  const m2 = await merge(cr.number, P("priya.raman"));
  console.log("  priya merge ->", m2.merged ? `merged, main ${before.slice(0, 12)} -> ${m2.commit?.slice(0, 12)}` : m2);
  const log = await prisma.refLog.findMany({ where: { refName: "main" }, orderBy: { id: "desc" }, take: 1 });
  console.log("  ref log:", log[0].reason, "by", log[0].actorId);
  console.log("audit chain:", await verifyChain());
  // stale approval scenario: a second CR approved, then a new commit
  const cr2 = await proposeEdit({ branch: `flow/s6-${Date.now().toString(36)}`, title: "Reduced rate 6% to 7%", edits: [{ path: "taxes.S6.amount", value: "0.07" }], actor: P("tam.tran") });
  await runChecks(cr2.number, P("tam.tran"));
  await review(cr2.number, P("priya.raman"), "approved");
  const { commitOnBranch, treeAt } = await import("../lib/vcs");
  const { applyEdit } = await import("../lib/config");
  await commitOnBranch(cr2.sourceRef, applyEdit(await treeAt(await head(cr2.sourceRef)), "taxes.S6.amount", "0.075"), P("tam.tran"), "amend to 7.5%");
  const d2 = await getRequest(cr2.number);
  console.log("stale scenario:", d2.reviews.map((r) => `${r.actorId}:${r.state}${r.stale ? "(stale)" : ""}`).join(", "), "| mergeable:", d2.mergeability.mergeable, d2.mergeability.reasons);
}
main().catch((e) => { console.error("FLOW FAILED:", e); process.exit(1); }).finally(() => prisma.$disconnect());
