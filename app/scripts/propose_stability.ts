import { proposeFromText } from "../lib/agent";
import { runChecks } from "../lib/changes";
import { findPrincipal } from "../lib/sod";
import { prisma } from "../lib/db";

const PHRASES = [
  "Raise sale VAT to 16% from October 1st",
  "Raise Sale VAT to sixteen percent from October first.",
  "Raise sale VAT to 16% from October first",
  "raise VAT to 16 percent",
  "Increase the sales VAT rate to sixteen percent starting October 1.",
  "Lower the reduced rate to 5 percent from January",
  "Make purchase VAT 16% from November first",
  "Make every tax depend on the weather",
];
async function main() {
  for (const text of PHRASES) {
    const t0 = Date.now();
    try {
      const p = await proposeFromText(text);
      const { impact } = await runChecks(p.number, findPrincipal("claude")!);
      const cr = await prisma.changeRequest.findUniqueOrThrow({ where: { number: p.number } });
      console.log(`OK  ${(Date.now() - t0) / 1000}s | "${text}"\n    ${p.edits.map((e) => `${e.path}=${JSON.stringify(e.value)}`).join(", ")} | eff ${cr.effectiveFrom?.toISOString().slice(0, 10)} | ${impact?.headline}\n    assumed: ${p.assumptions}`);
    } catch (e) {
      console.log(`ASK ${(Date.now() - t0) / 1000}s | "${text}" -> ${(e as Error).message}`);
    }
  }
}
main().finally(() => prisma.$disconnect());
