import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";
const MONTHS = Array.from({ length: 12 }, (_, i) => `2026-${String(i + 1).padStart(2, "0")}`);

export default async function TrialBalance({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const sp = await searchParams;
  const month = MONTHS.includes(sp.month ?? "") ? sp.month! : "2026-09";
  const [y, m] = month.split("-").map(Number);
  const end = new Date(Date.UTC(y, m, 1));
  const rows = await prisma.journalLine.groupBy({ by: ["accountCode"], where: { entry: { date: { lt: end } } }, _sum: { debitMinor: true, creditMinor: true } });
  const accounts = new Map((await prisma.account.findMany()).map((a) => [a.code, a]));
  const data = rows.map((r) => ({ code: r.accountCode, name: accounts.get(r.accountCode)?.name ?? "", type: accounts.get(r.accountCode)?.type ?? "", debit: r._sum.debitMinor ?? 0, credit: r._sum.creditMinor ?? 0 })).sort((a, b) => a.code.localeCompare(b.code));
  const total = data.reduce((s, r) => ({ d: s.d + r.debit, c: s.c + r.credit }), { d: 0, c: 0 });
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Trial balance</h1>
        <p className="text-sm text-[var(--muted)]">Every account with its balance up to the end of the month. It nets to zero when the books balance.</p>
      </div>
      <form className="panel p-3 flex items-end gap-3">
        <div><label className="label">Up to end of</label>
          <select className="select" name="month" defaultValue={month} style={{ width: "auto" }}>{MONTHS.map((mm) => <option key={mm} value={mm}>{mm}</option>)}</select></div>
        <button className="btn btn-primary" type="submit">Show</button>
      </form>
      <div className="panel overflow-x-auto">
        <table className="table">
          <thead><tr><th>Code</th><th>Account</th><th>Type</th><th className="num">Debit</th><th className="num">Credit</th><th className="num">Balance</th></tr></thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.code}><td className="hash">{r.code}</td><td>{r.name}</td><td className="text-[var(--muted)]">{r.type}</td><td className="num">{formatMoney(r.debit, "EUR")}</td><td className="num">{formatMoney(r.credit, "EUR")}</td><td className="num">{formatMoney(r.debit - r.credit, "EUR")}</td></tr>
            ))}
            <tr className="font-semibold"><td colSpan={3}>Total ({data.length} accounts)</td><td className="num">{formatMoney(total.d, "EUR")}</td><td className="num">{formatMoney(total.c, "EUR")}</td><td className="num" style={{ color: total.d === total.c ? "#1f6b3a" : "#a12626" }}>{formatMoney(total.d - total.c, "EUR")}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
