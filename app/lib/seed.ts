/**
 * Deterministic seed: the legacy demo chart of accounts and journals (OpenERP 7.0 account_minimal.xml), six taxes
 * modelled on account.tax, 120 invoices across 2026 with tax lines computed by the ported compute_all, and a posted
 * journal entry per validated invoice. Then the initial configuration commit with `main` pointing at it.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { computeAll, type TaxDef } from "./tax";
import { canonicalJson, hashObject } from "./canonical";
import { PRINCIPALS } from "./sod";
import type { ConfigTree } from "./config";



const TAXES: TaxDef[] = [
  { code: "S15", name: "Sale VAT 15%", type: "percent", amount: "0.15", typeTaxUse: "sale", priceInclude: false, includeBaseAmount: false, sequence: 10, active: true, accountCode: "X11003", description: "VAT-OUT-15" },
  { code: "S6", name: "Sale VAT 6% (reduced)", type: "percent", amount: "0.06", typeTaxUse: "sale", priceInclude: false, includeBaseAmount: false, sequence: 10, active: true, accountCode: "X11003", description: "VAT-OUT-6" },
  { code: "S0", name: "Sale exempt 0%", type: "percent", amount: "0", typeTaxUse: "sale", priceInclude: false, includeBaseAmount: false, sequence: 10, active: true, accountCode: "X11003", description: "VAT-OUT-0" },
  { code: "S15I", name: "Sale VAT 15% (price included)", type: "percent", amount: "0.15", typeTaxUse: "sale", priceInclude: true, includeBaseAmount: false, sequence: 10, active: true, accountCode: "X11003", description: "VAT-OUT-15-INC" },
  { code: "P15", name: "Purchase VAT 15% (recoverable)", type: "percent", amount: "0.15", typeTaxUse: "purchase", priceInclude: false, includeBaseAmount: false, sequence: 10, active: true, accountCode: "X11007", description: "VAT-IN-15" },
  { code: "P6", name: "Purchase VAT 6% (recoverable)", type: "percent", amount: "0.06", typeTaxUse: "purchase", priceInclude: false, includeBaseAmount: false, sequence: 10, active: true, accountCode: "X11007", description: "VAT-IN-6" },
];

const CUSTOMERS = ["Agrolait", "Camptocamp", "China Export", "Delta PC", "Distrib PC", "Ecole de Commerce de Liege", "Luminous Technologies", "Millennium Industries", "Vicking Direct", "Zenith Consulting"];
const SUPPLIERS = ["Axelor", "Chamber Works", "Maxtor", "Seagate", "Tiny sprl", "Wood y Wood Pecker"];
const PRODUCTS: { name: string; priceMinor: number; taxCodes: string[]; account: string }[] = [
  { name: "GrapWorks Software", priceMinor: 1_900_00, taxCodes: ["S15"], account: "X2001" },
  { name: "Datacard", priceMinor: 655_00, taxCodes: ["S15"], account: "X2001" },
  { name: "Service on demand", priceMinor: 120_00, taxCodes: ["S15"], account: "X2001" },
  { name: "Basic PC", priceMinor: 450_00, taxCodes: ["S15"], account: "X2001" },
  { name: "Books: Accounting for AI", priceMinor: 39_00, taxCodes: ["S6"], account: "X2001" },
  { name: "Training day", priceMinor: 800_00, taxCodes: ["S0"], account: "X2001" },
  { name: "Retail subscription (price incl.)", priceMinor: 23_00, taxCodes: ["S15I"], account: "X2001" },
];
const PURCHASES: { name: string; priceMinor: number; taxCodes: string[]; account: string }[] = [
  { name: "Office rent", priceMinor: 2_500_00, taxCodes: ["P15"], account: "X2110" },
  { name: "Cloud compute", priceMinor: 1_240_00, taxCodes: ["P15"], account: "X2110" },
  { name: "Printed materials", priceMinor: 180_00, taxCodes: ["P6"], account: "X2110" },
  { name: "Consulting", priceMinor: 950_00, taxCodes: ["P15"], account: "X2110" },
];

// deterministic PRNG (mulberry32)
function rng(seed: number) {
  return () => { let t = (seed += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function treeHashOf(tree: ConfigTree) { return hashObject("tree", canonicalJson(tree)); }

export async function seed(prisma: PrismaClient): Promise<string> {
  const chart = JSON.parse(readFileSync(join(process.cwd(), "data", "legacy_chart.json"), "utf8")) as { accounts: { xml_id: string; code: string; name: string; type: string; user_type: string; parent: string; reconcile: string }[]; journals: { code: string; name: string; type: string }[] };
  await prisma.$transaction([
    prisma.auditLog.deleteMany(), prisma.review.deleteMany(), prisma.check.deleteMany(), prisma.changeRequest.deleteMany(),
    prisma.refLog.deleteMany(), prisma.ref.deleteMany(), prisma.configCommit.deleteMany(),
    prisma.journalLine.deleteMany(), prisma.journalEntry.deleteMany(), prisma.invoiceTax.deleteMany(), prisma.invoiceLine.deleteMany(), prisma.invoice.deleteMany(),
    prisma.journal.deleteMany(), prisma.account.deleteMany(), prisma.company.deleteMany(), prisma.principal.deleteMany(),
  ]);
  await prisma.principal.createMany({ data: PRINCIPALS });
  await prisma.company.create({ data: { id: "main", name: "Halide Labs (demo company, from the OpenERP test chart)", currency: "EUR" } });
  const byXml = new Map(chart.accounts.map((a) => [a.xml_id, a.code]));
  await prisma.account.createMany({ data: chart.accounts.map((a) => ({ code: a.code, name: a.name.replace(" - (test)", ""), type: a.type, userType: a.user_type.replace("data_account_type_", ""), parentCode: byXml.get(a.parent) ?? null, reconcile: a.reconcile === "True", xmlId: a.xml_id })) });
  // extra postable accounts the legacy chart names but stores under views: revenue, expense, VAT in/out, receivable, payable
  const extra = [
    { code: "X2001", name: "Product Sales", type: "other", userType: "income" },
    { code: "X2110", name: "Expenses", type: "other", userType: "expense" },
    { code: "X11007", name: "Input VAT", type: "other", userType: "asset" },
    { code: "X1111", name: "Creditors", type: "payable", userType: "payable" },
  ];
  for (const e of extra) await prisma.account.upsert({ where: { code: e.code }, update: {}, create: { ...e, reconcile: e.type === "payable" } });
  await prisma.journal.createMany({ data: chart.journals.map((j) => ({ code: j.code, name: j.name.replace(" - (test)", ""), type: j.type })) });

  const tree: ConfigTree = { taxes: Object.fromEntries(TAXES.map((t) => [t.code, t])) };
  const commitHash = hashObject("commit", canonicalJson({ tree: treeHashOf(tree), parents: [], author: "system", message: "Configuration in force when version control was introduced" }));
  await prisma.configCommit.create({ data: { hash: commitHash, parents: [], tree: tree as object, authorId: "system", message: "Configuration in force when version control was introduced" } });
  await prisma.ref.create({ data: { name: "main", kind: "branch", commitHash, protected: true, createdBy: "system" } });
  await prisma.refLog.create({ data: { refName: "main", fromHash: null, toHash: commitHash, actorId: "system", reason: "repository initialised" } });

  const rand = rng(20260916);
  let entrySeq = 0;
  for (let i = 0; i < 120; i++) {
    const isSupplier = i % 3 === 2; // 80 customer, 40 supplier
    const month = i % 12; // spread across 2026
    const day = 1 + Math.floor(rand() * 27);
    const date = new Date(Date.UTC(2026, month, day));
    const number = isSupplier ? `SINV/2026/${String(i + 1).padStart(4, "0")}` : `INV/2026/${String(i + 1).padStart(4, "0")}`;
    const partner = isSupplier ? SUPPLIERS[Math.floor(rand() * SUPPLIERS.length)] : CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)];
    const catalogue = isSupplier ? PURCHASES : PRODUCTS;
    const nLines = 1 + Math.floor(rand() * 5);
    const state = i >= 110 ? "draft" : (month < 8 ? "paid" : "open");
    let untaxed = 0n, tax = 0n;
    const lines: { lineNo: number; description: string; accountCode: string; quantity: string; priceUnitMinor: number; taxCodes: string[]; subtotalMinor: number }[] = [];
    const taxLines: { lineNo: number; taxCode: string; taxName: string; baseMinor: number; amountMinor: number; accountCode: string | null }[] = [];
    for (let l = 0; l < nLines; l++) {
      const p = catalogue[Math.floor(rand() * catalogue.length)];
      const qty = String(1 + Math.floor(rand() * 8));
      const r = computeAll(p.taxCodes.map((c) => tree.taxes[c]), BigInt(p.priceMinor), qty);
      untaxed += r.totalMinor; tax += r.taxes.reduce((s, t) => s + t.amountMinor, 0n);
      lines.push({ lineNo: l + 1, description: p.name, accountCode: p.account, quantity: qty, priceUnitMinor: p.priceMinor, taxCodes: p.taxCodes, subtotalMinor: Number(r.totalMinor) });
      for (const t of r.taxes) taxLines.push({ lineNo: l + 1, taxCode: t.code, taxName: t.name, baseMinor: Number(r.totalMinor), amountMinor: Number(t.amountMinor), accountCode: t.accountCode ?? null });
    }
    let entryNumber: string | null = null;
    if (state !== "draft") {
      entryNumber = `${isSupplier ? "TEXJ" : "TSAJ"}/2026/${String(++entrySeq).padStart(4, "0")}`;
      const controlAccount = isSupplier ? "X1111" : "X11002";
      const jl: { lineNo: number; accountCode: string; name: string; debitMinor: number; creditMinor: number; partner: string; taxCode: string | null; invoiceNumber: string }[] = [];
      let ln = 0;
      const total = Number(untaxed + tax);
      jl.push({ lineNo: ++ln, accountCode: controlAccount, name: number, debitMinor: isSupplier ? 0 : total, creditMinor: isSupplier ? total : 0, partner, taxCode: null, invoiceNumber: number });
      for (const line of lines) jl.push({ lineNo: ++ln, accountCode: line.accountCode, name: line.description, debitMinor: isSupplier ? line.subtotalMinor : 0, creditMinor: isSupplier ? 0 : line.subtotalMinor, partner, taxCode: null, invoiceNumber: number });
      const byTax = new Map<string, { amount: number; account: string; name: string }>();
      for (const t of taxLines) { const cur = byTax.get(t.taxCode) ?? { amount: 0, account: t.accountCode ?? "X11003", name: t.taxName }; cur.amount += t.amountMinor; byTax.set(t.taxCode, cur); }
      for (const [code, t] of byTax) if (t.amount !== 0) jl.push({ lineNo: ++ln, accountCode: t.account, name: t.name, debitMinor: isSupplier ? t.amount : 0, creditMinor: isSupplier ? 0 : t.amount, partner, taxCode: code, invoiceNumber: number });
      await prisma.journalEntry.create({ data: { number: entryNumber, journalCode: isSupplier ? "TEXJ" : "TSAJ", date, ref: number, lines: { create: jl } } });
    }
    await prisma.invoice.create({ data: { number, kind: isSupplier ? "supplier" : "customer", companyId: "main", partner, date, state, currency: "EUR", journalCode: isSupplier ? "TEXJ" : "TSAJ", untaxedMinor: Number(untaxed), taxMinor: Number(tax), totalMinor: Number(untaxed + tax), configCommit: commitHash, entryNumber, lines: { create: lines }, taxLines: { create: taxLines } } });
  }
  const bal = await prisma.$queryRaw<{ d: bigint; c: bigint }[]>`SELECT COALESCE(SUM("debitMinor"),0)::bigint AS d, COALESCE(SUM("creditMinor"),0)::bigint AS c FROM "JournalLine"`;
  const summary = `seeded: ${await prisma.account.count()} accounts, ${await prisma.journal.count()} journals, ${await prisma.invoice.count()} invoices, ${await prisma.invoiceTax.count()} tax lines, ${await prisma.journalEntry.count()} entries, ${await prisma.journalLine.count()} journal lines; debits ${bal[0].d} = credits ${bal[0].c}; main @ ${commitHash.slice(0, 12)}`;
  console.log(summary);
  return summary;
}


