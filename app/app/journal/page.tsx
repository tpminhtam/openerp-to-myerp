import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Journal({ searchParams }: { searchParams: Promise<{ account?: string; month?: string; q?: string }> }) {
  const sp = await searchParams;
  const account = sp.account?.trim() || "";
  const month = sp.month?.trim() || "";
  const q = sp.q?.trim() || "";
  const where: Record<string, unknown> = {};
  if (account) where.accountCode = { startsWith: account.toUpperCase() };
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { partner: { contains: q, mode: "insensitive" } }, { invoiceNumber: { contains: q, mode: "insensitive" } }];
  if (/^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    where.entry = { date: { gte: new Date(Date.UTC(y, m - 1, 1)), lt: new Date(Date.UTC(y, m, 1)) } };
  }
  const lines = await prisma.journalLine.findMany({ where, include: { entry: true }, orderBy: [{ entry: { date: "asc" } }, { entryNumber: "asc" }, { lineNo: "asc" }], take: 200 });
  const accounts = new Map((await prisma.account.findMany()).map((a) => [a.code, a.name]));
  const totals = lines.reduce((s, l) => ({ d: s.d + l.debitMinor, c: s.c + l.creditMinor }), { d: 0, c: 0 });
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Universal journal</h1>
        <p className="text-sm text-[var(--muted)]">One line table for every posting. Any line links back to the invoice that produced it.</p>
      </div>
      <form className="panel p-3 grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <div><label className="label">Account code</label><input className="input" name="account" defaultValue={account} placeholder="X11003" /></div>
        <div><label className="label">Month</label><input className="input" name="month" defaultValue={month} placeholder="2026-09" /></div>
        <div><label className="label">Text</label><input className="input" name="q" defaultValue={q} placeholder="partner, invoice, description" /></div>
        <div><button className="btn btn-primary" type="submit">Search</button> <Link className="btn" href="/journal">Clear</Link></div>
      </form>
      <div className="panel overflow-x-auto">
        <table className="table">
          <thead><tr><th>Entry</th><th>Date</th><th>Account</th><th>Name</th><th className="num">Debit</th><th className="num">Credit</th><th>Partner</th><th>Tax</th><th>Invoice</th></tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id}>
                <td className="hash">{l.entryNumber}</td>
                <td>{fmtDate(l.entry.date)}</td>
                <td><span className="hash">{l.accountCode}</span> <span className="text-[var(--muted)]">{accounts.get(l.accountCode)}</span></td>
                <td>{l.name}</td>
                <td className="num">{l.debitMinor ? formatMoney(l.debitMinor, "EUR") : ""}</td>
                <td className="num">{l.creditMinor ? formatMoney(l.creditMinor, "EUR") : ""}</td>
                <td>{l.partner}</td>
                <td className="hash">{l.taxCode ?? ""}</td>
                <td>{l.invoiceNumber && <Link className="underline" href={`/invoices/${encodeURIComponent(l.invoiceNumber)}`}>{l.invoiceNumber}</Link>}</td>
              </tr>
            ))}
            <tr><td colSpan={4} className="font-semibold">{lines.length} lines{lines.length === 200 ? " (first 200)" : ""}</td><td className="num font-semibold">{formatMoney(totals.d, "EUR")}</td><td className="num font-semibold">{formatMoney(totals.c, "EUR")}</td><td colSpan={3}></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
