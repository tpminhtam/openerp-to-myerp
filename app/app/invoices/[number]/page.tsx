import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";
import { Hash, StatusBadge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function InvoiceDetail({ params }: { params: Promise<{ number: string }> }) {
  const number = decodeURIComponent((await params).number);
  const inv = await prisma.invoice.findUnique({ where: { number }, include: { lines: { orderBy: { lineNo: "asc" } }, taxLines: { orderBy: [{ lineNo: "asc" }, { id: "asc" }] } } });
  if (!inv) notFound();
  const entry = inv.entryNumber ? await prisma.journalEntry.findUnique({ where: { number: inv.entryNumber }, include: { lines: { orderBy: { lineNo: "asc" } } } }) : null;
  const accounts = new Map((await prisma.account.findMany()).map((a) => [a.code, a.name]));
  const c = inv.currency;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs text-[var(--muted)]"><Link className="underline" href="/invoices">Invoices</Link> / {inv.kind}</div>
          <h1 className="text-xl font-semibold">{inv.number} <StatusBadge status={inv.state} /></h1>
          <div className="text-sm text-[var(--muted)]">{inv.partner} · {fmtDate(inv.date)} · journal {inv.journalCode} · computed with configuration <Hash value={inv.configCommit} /></div>
        </div>
        <div className="panel p-3 text-right">
          <div className="text-xs text-[var(--muted)]">Untaxed {formatMoney(inv.untaxedMinor, c)} · Tax {formatMoney(inv.taxMinor, c)}</div>
          <div className="kpi">{formatMoney(inv.totalMinor, c)}</div>
        </div>
      </div>
      <section className="panel overflow-x-auto">
        <div className="px-4 pt-3 font-semibold">Lines</div>
        <table className="table">
          <thead><tr><th>#</th><th>Description</th><th>Account</th><th className="num">Qty</th><th className="num">Unit price</th><th>Taxes</th><th className="num">Subtotal</th></tr></thead>
          <tbody>{inv.lines.map((l) => (
            <tr key={l.id}><td>{l.lineNo}</td><td>{l.description}</td><td><span className="hash">{l.accountCode}</span> <span className="text-[var(--muted)]">{accounts.get(l.accountCode)}</span></td><td className="num">{l.quantity}</td><td className="num">{formatMoney(l.priceUnitMinor, c)}</td><td className="hash">{l.taxCodes.join(", ")}</td><td className="num">{formatMoney(l.subtotalMinor, c)}</td></tr>
          ))}</tbody>
        </table>
      </section>
      <section className="panel overflow-x-auto">
        <div className="px-4 pt-3 font-semibold">Tax lines <span className="text-xs font-normal text-[var(--muted)]">(the legacy account.invoice.tax, per line and tax)</span></div>
        <table className="table">
          <thead><tr><th>Line</th><th>Tax</th><th className="num">Base</th><th className="num">Amount</th><th>Account</th></tr></thead>
          <tbody>{inv.taxLines.map((t) => (
            <tr key={t.id}><td>{t.lineNo}</td><td><span className="hash">{t.taxCode}</span> {t.taxName}</td><td className="num">{formatMoney(t.baseMinor, c)}</td><td className="num">{formatMoney(t.amountMinor, c)}</td><td className="hash">{t.accountCode ?? ""}</td></tr>
          ))}</tbody>
        </table>
      </section>
      <section className="panel overflow-x-auto">
        <div className="px-4 pt-3 font-semibold">Journal entry {entry ? <span className="hash">{entry.number}</span> : <span className="text-xs font-normal text-[var(--muted)]">none: the invoice is a draft</span>}</div>
        {entry && (
          <table className="table">
            <thead><tr><th>#</th><th>Account</th><th>Name</th><th className="num">Debit</th><th className="num">Credit</th><th>Tax</th></tr></thead>
            <tbody>{entry.lines.map((l) => (
              <tr key={l.id}><td>{l.lineNo}</td><td><span className="hash">{l.accountCode}</span> <span className="text-[var(--muted)]">{accounts.get(l.accountCode)}</span></td><td>{l.name}</td><td className="num">{l.debitMinor ? formatMoney(l.debitMinor, c) : ""}</td><td className="num">{l.creditMinor ? formatMoney(l.creditMinor, c) : ""}</td><td className="hash">{l.taxCode ?? ""}</td></tr>
            ))}</tbody>
          </table>
        )}
      </section>
    </div>
  );
}
