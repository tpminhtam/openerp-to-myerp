import Link from "next/link";
import { prisma } from "@/lib/db";
import { verifyChain } from "@/lib/audit";
import { formatMoney } from "@/lib/money";
import { head } from "@/lib/vcs";
import { ledgerBalance, taxByTax } from "@/lib/queries";
import { Badge, Hash, StatusBadge } from "@/components/Badge";
import { fmtTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Overview() {
  const [invoices, entries, lines, balance, mainHash, taxes, open, chain] = await Promise.all([
    prisma.invoice.count(), prisma.journalEntry.count(), prisma.journalLine.count(), ledgerBalance(), head("main"), taxByTax(),
    prisma.changeRequest.findMany({ where: { status: "open" }, orderBy: { openedAt: "desc" }, take: 8 }), verifyChain(),
  ]);
  const commit = await prisma.configCommit.findUniqueOrThrow({ where: { hash: mainHash } });
  const max = Math.max(1, ...taxes.map((t) => Math.abs(t.amountMinor)));
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">Overview</h1>
        <p className="text-sm text-[var(--muted)]">The ledger and tax results of the demo company, on the business date 16 September 2026. Every number here is derived from the seeded invoices and the configuration in force.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Invoices" value={invoices.toLocaleString()} sub="80 customer · 40 supplier" />
        <Kpi label="Posted entries" value={entries.toLocaleString()} sub="from validated invoices" />
        <Kpi label="Journal lines" value={lines.toLocaleString()} sub={`${formatMoney(balance.debit, "EUR")} each side`} />
        <Kpi label="Books balanced" value={balance.balanced ? "yes" : "NO"} sub={balance.balanced ? "debits = credits" : `off by ${formatMoney(balance.debit - balance.credit, "EUR")}`} tone={balance.balanced ? "ok" : "bad"} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="panel p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Tax by tax</h2>
            <span className="text-xs text-[var(--muted)]">sum of invoice tax lines</span>
          </div>
          <table className="table">
            <thead><tr><th>Tax</th><th className="num">Invoices</th><th className="num">Amount</th><th style={{ width: "30%" }}></th></tr></thead>
            <tbody>
              {taxes.map((t) => (
                <tr key={t.taxCode}>
                  <td><span className="hash">{t.taxCode}</span> {t.taxName}</td>
                  <td className="num">{t.invoices}</td>
                  <td className="num">{formatMoney(t.amountMinor, "EUR")}</td>
                  <td><div className="bar"><div style={{ width: `${(Math.abs(t.amountMinor) / max) * 100}%` }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="flex flex-col gap-4">
          <section className="panel p-4">
            <h2 className="font-semibold mb-2">Configuration in force</h2>
            <div className="text-sm"><span className="text-[var(--muted)]">main →</span> <Hash value={mainHash} /></div>
            <div className="text-sm mt-1">{commit.message}</div>
            <div className="text-xs text-[var(--muted)] mt-1">by {commit.authorId} · {fmtTime(commit.committedAt)} · <Link className="underline" href="/taxes">taxes</Link> · <Link className="underline" href="/history">history</Link></div>
          </section>
          <section className="panel p-4">
            <h2 className="font-semibold mb-2">Audit chain</h2>
            {chain.ok ? <Badge kind="success">verified · {chain.rows} rows</Badge> : <Badge kind="failure">broken at row {chain.brokenAt}</Badge>}
            <span className="text-xs text-[var(--muted)] ml-2">every row hashes the previous one · <Link className="underline" href="/audit">audit log</Link></span>
          </section>
          <section className="panel p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Open change requests</h2>
              <Link className="text-xs underline" href="/changes">all</Link>
            </div>
            {open.length === 0 ? <div className="text-sm text-[var(--muted)]">None open. <Link className="underline" href="/taxes">Propose a change</Link>.</div> : (
              <table className="table">
                <tbody>
                  {open.map((cr) => (
                    <tr key={cr.number}>
                      <td><Link className="underline" href={`/changes/${cr.number}`}>{cr.number}</Link></td>
                      <td>{cr.title}</td>
                      <td><StatusBadge status={cr.status} /></td>
                      <td className="text-[var(--muted)]">{cr.openedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "ok" | "bad" }) {
  return (
    <div className="panel p-4">
      <div className="label">{label}</div>
      <div className="kpi" style={{ color: tone === "ok" ? "#1f6b3a" : tone === "bad" ? "#a12626" : undefined }}>{value}</div>
      {sub && <div className="text-xs text-[var(--muted)] mt-1">{sub}</div>}
    </div>
  );
}
