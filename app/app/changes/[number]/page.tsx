import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequest } from "@/lib/changes";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import type { ReplayResult } from "@/lib/replay";
import { findPrincipal } from "@/lib/sod";
import { Badge, Hash, StatusBadge } from "@/components/Badge";
import { ChangeActions, ClaudePanel } from "@/components/ChangeActions";
import { currentActor } from "@/lib/queries";
import { fmtDate, fmtTime } from "@/lib/format";

export const dynamic = "force-dynamic";

function show(v: unknown): string {
  if (v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default async function ChangeDetail({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const exists = await prisma.changeRequest.findUnique({ where: { number } });
  if (!exists) notFound();
  const d = await getRequest(number);
  const cr = d.request;
  const actor = await currentActor();
  const impactCheck = d.checks[2];
  const impact = impactCheck ? (impactCheck.detail as unknown as ReplayResult) : null;
  const name = (id: string) => findPrincipal(id)?.displayName ?? id;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs text-[var(--muted)]"><Link className="underline" href="/changes">Change requests</Link></div>
          <h1 className="text-xl font-semibold">{cr.number} · {cr.title} <StatusBadge status={cr.status} /></h1>
          <div className="text-sm text-[var(--muted)]">
            <span className="hash">{cr.sourceRef}</span> → <span className="hash">{cr.targetRef}</span> · head <Hash value={cr.headHash} /> · base <Hash value={cr.baseHash} /> · proposed by {name(cr.openedBy)} · {fmtTime(cr.openedAt)}
            {cr.effectiveFrom && <> · effective from {fmtDate(cr.effectiveFrom)}</>}
            {cr.mergedBy && <> · merged by {name(cr.mergedBy)} {fmtTime(cr.mergedAt)}</>}
          </div>
          {cr.body && <p className="text-sm mt-1">{cr.body}</p>}
        </div>
      </div>

      <section className="panel p-4">
        <ChangeActions number={cr.number} status={cr.status} actorName={actor.displayName} mergeable={d.mergeability.mergeable} reasons={d.mergeability.reasons} />
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="panel overflow-x-auto">
          <div className="px-4 pt-3 font-semibold">Diff <span className="text-xs font-normal text-[var(--muted)]">merge base → head, one row per changed field</span></div>
          <table className="table">
            <thead><tr><th>Path</th><th>Before</th><th>After</th></tr></thead>
            <tbody>
              {d.diff.length === 0 && <tr><td colSpan={3} className="text-[var(--muted)]">No differences.</td></tr>}
              {d.diff.map((x) => <tr key={x.path}><td className="hash">{x.path}</td><td className="hash" style={{ color: "#a12626" }}>{show(x.before)}</td><td className="hash" style={{ color: "#1f6b3a" }}>{show(x.after)}</td></tr>)}
            </tbody>
          </table>
        </section>
        <section className="panel overflow-x-auto">
          <div className="px-4 pt-3 font-semibold">Checks <span className="text-xs font-normal text-[var(--muted)]">required on the current head</span></div>
          <table className="table">
            <thead><tr><th>Check</th><th>Conclusion</th><th>Summary</th></tr></thead>
            <tbody>
              {(["merge-clean", "config-loads", "impact"] as const).map((n, i) => {
                const c = d.checks[i];
                return <tr key={n}><td className="hash">{n}</td><td>{c ? <Badge kind={c.conclusion === "success" ? "success" : "failure"}>{c.conclusion}</Badge> : <Badge kind="stale">not run</Badge>}</td><td>{c?.summary ?? "Run checks to evaluate this head."}</td></tr>;
              })}
            </tbody>
          </table>
        </section>
      </div>

      <section className="panel p-4">
        <div className="font-semibold">Impact <span className="text-xs font-normal text-[var(--muted)]">every invoice replayed through the configuration in force and the proposed one</span></div>
        {!impact ? <div className="text-sm text-[var(--muted)] mt-2">Run checks to replay the books.</div> : (
          <div className="flex flex-col gap-4 mt-2">
            <div className="text-2xl font-semibold tracking-tight">{impact.headline}</div>
            <div className="text-xs text-[var(--muted)]">{impact.invoicesReplayed} invoices replayed in {impact.durationMs} ms · {impact.parity.length === 0 ? "every recomputed line equals its stored tax (parity ok)" : `${impact.parity.length} parity mismatch(es)`}{impact.errors.length ? ` · ${impact.errors.length} error(s)` : ""}</div>
            <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
              <div className="overflow-x-auto">
                <div className="label">By currency</div>
                <table className="table">
                  <thead><tr><th>Currency</th><th className="num">Before</th><th className="num">After</th><th className="num">Delta</th></tr></thead>
                  <tbody>{impact.totalsByCurrency.map((t) => <tr key={t.currency}><td>{t.currency}</td><td className="num">{t.baseDisplay}</td><td className="num">{t.headDisplay}</td><td className="num font-semibold">{t.deltaDisplay}</td></tr>)}</tbody>
                </table>
                <div className="label mt-4">By tax</div>
                <table className="table">
                  <thead><tr><th>Tax</th><th className="num">Invoices</th><th className="num">Before</th><th className="num">After</th><th className="num">Delta</th></tr></thead>
                  <tbody>
                    {impact.byTax.length === 0 && <tr><td colSpan={5} className="text-[var(--muted)]">No tax total moved.</td></tr>}
                    {impact.byTax.map((t) => <tr key={t.taxCode}><td><span className="hash">{t.taxCode}</span> {t.taxName}</td><td className="num">{t.invoices}</td><td className="num">{t.baseDisplay}</td><td className="num">{t.headDisplay}</td><td className="num font-semibold">{t.deltaDisplay}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="overflow-x-auto">
                <div className="label">Top movers</div>
                <table className="table">
                  <thead><tr><th>Invoice</th><th>Partner</th><th>Date</th><th className="num">Before</th><th className="num">After</th><th className="num">Delta</th></tr></thead>
                  <tbody>
                    {impact.movers.length === 0 && <tr><td colSpan={6} className="text-[var(--muted)]">No invoice moved.</td></tr>}
                    {impact.movers.map((m) => <tr key={m.number}><td><Link className="underline" href={`/invoices/${encodeURIComponent(m.number)}`}>{m.number}</Link></td><td>{m.partner}</td><td>{m.date}</td><td className="num">{m.baseDisplay}</td><td className="num">{m.headDisplay}</td><td className="num font-semibold">{m.deltaDisplay}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="panel overflow-x-auto">
          <div className="px-4 pt-3 font-semibold">Reviews <span className="text-xs font-normal text-[var(--muted)]">append-only; bound to the commit reviewed</span></div>
          <table className="table">
            <thead><tr><th>Who</th><th>State</th><th>Head</th><th>Note</th><th>When</th></tr></thead>
            <tbody>
              {d.reviews.length === 0 && <tr><td colSpan={5} className="text-[var(--muted)]">No reviews yet.</td></tr>}
              {d.reviews.map((r) => (
                <tr key={r.id}>
                  <td>{name(r.actorId)}</td>
                  <td><StatusBadge status={r.state} />{r.ruleId && <> <Badge kind="blocked">{r.ruleId}</Badge></>}{r.stale && <> <Badge kind="stale">stale</Badge></>}</td>
                  <td><Hash value={r.headHash} len={8} /></td>
                  <td className="text-xs">{r.note}</td>
                  <td className="text-[var(--muted)] text-xs">{fmtTime(r.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 pb-3 text-xs text-[var(--muted)]">Mergeable: {d.mergeability.mergeable ? "yes" : `no (${d.mergeability.reasons.join("; ")})`} · approvals on current head: {d.mergeability.approvals} · stale: {d.mergeability.staleApprovals}</div>
        </section>
        <ClaudePanel number={cr.number} status={cr.status} />
      </div>
      <div className="text-xs text-[var(--muted)]">Money shown as {formatMoney(0, "EUR").split(" ")[0]} minor units formatted; rates are decimal strings; the replay is a pure function (lib/replay.ts) over the ported compute_all (lib/tax.ts).</div>
    </div>
  );
}
