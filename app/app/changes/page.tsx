import Link from "next/link";
import { prisma } from "@/lib/db";
import { Dot, StatusBadge } from "@/components/Badge";
import { fmtTime } from "@/lib/format";
import { latestChecksFor } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Changes() {
  const requests = await prisma.changeRequest.findMany({ orderBy: { openedAt: "desc" } });
  const checks = await Promise.all(requests.map((r) => latestChecksFor(r.number, r.headHash)));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Change requests</h1>
          <p className="text-sm text-[var(--muted)]">Every rule change is a pull request against the books: diff, three checks, review under segregation of duties, merge.</p>
        </div>
        <Link className="btn btn-primary" href="/taxes">Propose a change</Link>
      </div>
      <div className="panel overflow-x-auto">
        <table className="table">
          <thead><tr><th>Number</th><th>Title</th><th>Branch</th><th>Status</th><th>Checks</th><th>Proposer</th><th>Opened</th></tr></thead>
          <tbody>
            {requests.length === 0 && <tr><td colSpan={7} className="text-[var(--muted)]">No change requests yet.</td></tr>}
            {requests.map((r, i) => (
              <tr key={r.number}>
                <td><Link className="underline font-medium" href={`/changes/${r.number}`}>{r.number}</Link></td>
                <td>{r.title}</td>
                <td className="hash">{r.sourceRef} → {r.targetRef}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>{checks[i].map((c, j) => <Dot key={j} conclusion={c?.conclusion} />)}</td>
                <td>{r.openedBy}</td>
                <td className="text-[var(--muted)]">{fmtTime(r.openedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
