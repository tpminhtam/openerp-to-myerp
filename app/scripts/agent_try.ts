import { proposeFromText, explainRequest } from "../lib/agent";
import { runChecks } from "../lib/changes";
import { findPrincipal } from "../lib/sod";
import { prisma } from "../lib/db";

async function main() {
  const t0 = Date.now();
  const p = await proposeFromText("Please raise the reduced Sale VAT from 6% to 7% starting 1 November 2026, the ministry announced it this morning.");
  console.log(`propose (${Date.now() - t0} ms):`, p.number, "|", p.title, "|", JSON.stringify(p.edits), "| branch", p.branch);
  console.log("  rationale:", p.rationale);
  const cr = await prisma.changeRequest.findUniqueOrThrow({ where: { number: p.number } });
  console.log("  opened by:", cr.openedBy, "| effectiveFrom:", cr.effectiveFrom?.toISOString().slice(0, 10));
  const { impact } = await runChecks(p.number, findPrincipal("claude")!);
  console.log("  checks by claude:", impact?.headline);
  const t1 = Date.now();
  const e = await explainRequest(p.number);
  console.log(`explain (${Date.now() - t1} ms; attempts ${e.attempts}; figures checked ${e.figuresChecked}; grounded ${e.grounded}; ungrounded ${JSON.stringify(e.ungrounded)}):`);
  console.log("  " + e.note.replace(/\n/g, "\n  "));
  const bad = await proposeFromText("Make every tax a Python expression that reads the moon phase");
  console.log("nonsense request ->", bad);
}
main().catch((e) => console.error("AGENT TRY:", e.message)).finally(() => prisma.$disconnect());
