/**
 * Claude as a governed principal. It proposes and explains through the same service layer a person uses,
 * as the `claude` principal, and it is refused from approving or merging by SOD-02 in lib/sod.ts.
 * Model calls use the official Anthropic SDK; nothing the model says becomes a number in the system:
 * proposals are validated against the configuration, explanations are checked against the impact result.
 */
import Anthropic from "@anthropic-ai/sdk";
import { applyEdit, type ConfigTree } from "./config";
import { getRequest, proposeEdit } from "./changes";
import { findPrincipal } from "./sod";
import { head, treeAt } from "./vcs";
import { formatRate } from "./money";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5";

function client(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw Object.assign(new Error("ANTHROPIC_API_KEY is not set on the server; the agent actions need it. Everything else works without it."), { status: 400 });
  }
  return new Anthropic();
}

function describeTaxes(tree: ConfigTree): string {
  return Object.values(tree.taxes)
    .sort((a, b) => a.code.localeCompare(b.code))
    .map((t) => `- ${t.code}: "${t.name}", type=${t.type}, amount=${t.amount}${t.type === "percent" ? ` (${formatRate(t.amount)})` : ""}, use=${t.typeTaxUse}, priceInclude=${t.priceInclude}, includeBaseAmount=${t.includeBaseAmount}, sequence=${t.sequence}, active=${t.active}`)
    .join("\n");
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("The model did not return JSON");
  return JSON.parse(text.slice(start, end + 1));
}

async function ask(system: string, user: string, maxTokens = 1500): Promise<string> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: user }],
  });
  if (res.stop_reason === "refusal") throw new Error("The model declined this request");
  return res.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n");
}

export interface ProposalOut { number: string; title: string; edits: { path: string; value: unknown }[]; rationale: string; branch: string }

/** "Raise Sale VAT to 16% from 1 October 2026" → validated edits → branch + commit + change request opened as Claude. */
export async function proposeFromText(text: string): Promise<ProposalOut> {
  const claude = findPrincipal("claude")!;
  const tree = await treeAt(await head("main"));
  const system = `You turn a finance user's plain-English request into a structured tax configuration change for myERP.
The configuration in force (tax codes and fields):
${describeTaxes(tree)}

Rules: only these fields may change: amount (decimal string; percent taxes use 0-1, so 16% is "0.16"), name (string), active (boolean), sequence (integer), priceInclude (boolean), includeBaseAmount (boolean). Paths look like "taxes.S15.amount". Never invent tax codes. If the request is ambiguous or asks for something outside these fields, return {"error": "<one sentence>"}.
Respond with JSON only, no prose, in this shape:
{"title": "<short title>", "branch": "claude/<slug>", "edits": [{"path": "taxes.<code>.<field>", "value": <json value>}], "effectiveFrom": "<YYYY-MM-DD or null>", "rationale": "<one or two sentences>"}`;
  const raw = await ask(system, text, 800);
  const parsed = extractJson(raw) as { error?: string; title?: string; branch?: string; edits?: { path: string; value: unknown }[]; effectiveFrom?: string | null; rationale?: string };
  if (parsed.error) throw Object.assign(new Error(parsed.error), { status: 400 });
  if (!parsed.edits?.length || !parsed.title) throw new Error("The model returned no edits");
  // Deterministic validation: every path must exist and the values must be well-formed before anything is written.
  let check = tree;
  for (const e of parsed.edits) check = applyEdit(check, e.path, e.value);
  const branch = (parsed.branch ?? `claude/${Date.now()}`).replace(/[^a-z0-9/_-]/gi, "-").toLowerCase();
  const cr = await proposeEdit({
    branch: `${branch}-${Date.now().toString(36)}`,
    title: parsed.title,
    body: `Proposed by Claude from: "${text}"\n\n${parsed.rationale ?? ""}`,
    edits: parsed.edits,
    effectiveFrom: parsed.effectiveFrom ?? undefined,
    actor: claude,
  });
  return { number: cr.number, title: cr.title, edits: parsed.edits, rationale: parsed.rationale ?? "", branch: cr.sourceRef };
}

export interface ExplainOut { note: string; grounded: boolean; ungrounded: string[]; figuresChecked: number; attempts: number }

/** Every figure in the note must appear in the impact result; one automatic revision, then a warning. */
export async function explainRequest(number: string): Promise<ExplainOut> {
  const detail = await getRequest(number);
  const impactCheck = detail.checks.find((c) => c?.name === "impact");
  if (!impactCheck) throw Object.assign(new Error("Run the checks first; the explanation is written from the impact result."), { status: 400 });
  const impact = impactCheck.detail as unknown as { headline: string; invoicesReplayed: number; invoicesChanged: number; totalsByCurrency: { baseDisplay: string; headDisplay: string; deltaDisplay: string }[]; byTax: { taxCode: string; taxName: string; invoices: number; baseDisplay: string; headDisplay: string; deltaDisplay: string }[]; movers: { number: string; partner: string; deltaDisplay: string; baseDisplay: string; headDisplay: string }[] };
  const facts = {
    request: { number, title: detail.request.title, proposer: detail.request.openedBy, status: detail.request.status },
    diff: detail.diff,
    impact: { headline: impact.headline, invoicesReplayed: impact.invoicesReplayed, invoicesChanged: impact.invoicesChanged, totals: impact.totalsByCurrency, byTax: impact.byTax, topMovers: impact.movers.slice(0, 5) },
    checks: detail.checks.map((c) => c && { name: c.name, conclusion: c.conclusion, summary: c.summary }),
  };
  const allowed = allowedFigures(facts);
  const system = `You are the finance assistant inside myERP. Write a review note for a tax configuration change request, for a tax reviewer, in at most four sentences. Use only the numbers in the facts, written exactly as they appear there (same formatting, e.g. "EUR 4,812.40", "37 of 120 invoices"). Say what changes, what it moves, who is most affected, and whether the checks passed. Do not approve or recommend approval; that is the reviewer's decision. Plain text, no markdown.`;
  let note = await ask(system, `Facts (JSON):\n${JSON.stringify(facts)}`, 600);
  let ungrounded = findUngrounded(note, allowed);
  let attempts = 1;
  if (ungrounded.length) {
    note = await ask(system, `Facts (JSON):\n${JSON.stringify(facts)}\n\nYour previous note contained figures that are not in the facts: ${ungrounded.join(", ")}. Rewrite it using only figures from the facts, formatted exactly as they appear.`, 600);
    ungrounded = findUngrounded(note, allowed);
    attempts = 2;
  }
  return { note: note.trim(), grounded: ungrounded.length === 0, ungrounded, figuresChecked: countFigures(note), attempts };
}

function allowedFigures(facts: unknown): Set<string> {
  const out = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === "number") out.add(String(v));
    else if (typeof v === "string") for (const m of v.matchAll(/\d[\d,]*(?:\.\d+)?/g)) out.add(m[0]);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(facts);
  return out;
}

function countFigures(note: string): number {
  return [...note.matchAll(/\d[\d,]*(?:\.\d+)?/g)].length;
}

/** Figures in the note that do not appear anywhere in the facts (percent signs and years are tolerated as written). */
function findUngrounded(note: string, allowed: Set<string>): string[] {
  const bad: string[] = [];
  for (const m of note.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
    const token = m[0];
    if (allowed.has(token) || allowed.has(token.replace(/,/g, ""))) continue;
    if (/^20\d\d$/.test(token)) continue;
    bad.push(token);
  }
  return [...new Set(bad)];
}
