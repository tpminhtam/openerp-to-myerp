import { prisma } from "@/lib/db";
import { Hash } from "@/components/Badge";
import { VerifyButton } from "@/components/VerifyButton";
import { fmtTime } from "@/lib/format";
import { findPrincipal } from "@/lib/sod";

export const dynamic = "force-dynamic";

export default async function Audit() {
  const rows = await prisma.auditLog.findMany({ orderBy: { id: "desc" }, take: 200 });
  const name = (id: string) => findPrincipal(id)?.displayName ?? id;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Audit log</h1>
          <p className="text-sm text-[var(--muted)]">Append-only. Each row stores the previous row&apos;s hash and its own, so editing any row breaks the chain. Refused attempts are rows too: a control that operated is evidence.</p>
        </div>
        <VerifyButton />
      </div>
      <div className="panel overflow-x-auto">
        <table className="table">
          <thead><tr><th>#</th><th>When</th><th>Actor</th><th>Action</th><th>Object</th><th>Summary</th><th>Hash</th><th>Prev</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}><td>{r.id}</td><td className="text-xs">{fmtTime(r.at)}</td><td>{name(r.actorId)}</td><td className="hash">{r.action}</td><td className="hash">{r.objectType} {r.objectId}</td><td>{r.summary}</td><td><Hash value={r.hash} len={10} /></td><td><Hash value={r.prevHash} len={10} /></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
