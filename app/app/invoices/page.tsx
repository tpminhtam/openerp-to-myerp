import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";
import { StatusBadge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function Invoices({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const sp = await searchParams;
  const kind = sp.kind === "customer" || sp.kind === "supplier" ? sp.kind : undefined;
  const invoices = await prisma.invoice.findMany({ where: kind ? { kind } : {}, orderBy: { number: "asc" } });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Invoices</h1>
          <p className="text-sm text-[var(--muted)]">120 invoices across 2026 in OpenERP&apos;s shape; tax lines computed by the ported compute_all.</p>
        </div>
        <div className="flex gap-2">
          {[["", "All"], ["customer", "Customer"], ["supplier", "Supplier"]].map(([k, label]) => (
            <Link key={k} className={`btn ${(kind ?? "") === k ? "btn-primary" : ""}`} href={k ? `/invoices?kind=${k}` : "/invoices"}>{label}</Link>
          ))}
        </div>
      </div>
      <div className="panel overflow-x-auto">
        <table className="table">
          <thead><tr><th>Number</th><th>Kind</th><th>Partner</th><th>Date</th><th>State</th><th className="num">Untaxed</th><th className="num">Tax</th><th className="num">Total</th><th>Entry</th></tr></thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i.number}>
                <td><Link className="underline" href={`/invoices/${encodeURIComponent(i.number)}`}>{i.number}</Link></td>
                <td>{i.kind}</td><td>{i.partner}</td><td>{fmtDate(i.date)}</td><td><StatusBadge status={i.state} /></td>
                <td className="num">{formatMoney(i.untaxedMinor, i.currency)}</td><td className="num">{formatMoney(i.taxMinor, i.currency)}</td><td className="num">{formatMoney(i.totalMinor, i.currency)}</td>
                <td className="hash">{i.entryNumber ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
