/** Read-only Prisma queries for server components. */
import { prisma } from "./db";
import { cookies } from "next/headers";
import { findPrincipal, type Principal } from "./sod";

export async function currentActor(): Promise<Principal> {
  const jar = await cookies();
  return findPrincipal(jar.get("actor")?.value) ?? findPrincipal("tam.tran")!;
}

export async function ledgerBalance() {
  const rows = await prisma.$queryRaw<{ d: bigint; c: bigint }[]>`SELECT COALESCE(SUM("debitMinor"),0)::bigint AS d, COALESCE(SUM("creditMinor"),0)::bigint AS c FROM "JournalLine"`;
  return { debit: Number(rows[0].d), credit: Number(rows[0].c), balanced: rows[0].d === rows[0].c };
}

export async function taxByTax() {
  const rows = await prisma.invoiceTax.groupBy({ by: ["taxCode", "taxName"], _sum: { amountMinor: true }, _count: { invoiceNumber: true } });
  const invoices = await prisma.invoiceTax.findMany({ select: { taxCode: true, invoiceNumber: true }, distinct: ["taxCode", "invoiceNumber"] });
  const invCount = new Map<string, number>();
  for (const r of invoices) invCount.set(r.taxCode, (invCount.get(r.taxCode) ?? 0) + 1);
  return rows.map((r) => ({ taxCode: r.taxCode, taxName: r.taxName, amountMinor: r._sum.amountMinor ?? 0, invoices: invCount.get(r.taxCode) ?? 0 })).sort((a, b) => Math.abs(b.amountMinor) - Math.abs(a.amountMinor));
}

export async function latestChecksFor(number: string, headHash: string) {
  const checks = await prisma.check.findMany({ where: { requestNumber: number, headHash }, orderBy: { id: "desc" } });
  const latest = new Map<string, (typeof checks)[number]>();
  for (const c of checks) if (!latest.has(c.name)) latest.set(c.name, c);
  return ["merge-clean", "config-loads", "impact"].map((n) => latest.get(n) ?? null);
}
