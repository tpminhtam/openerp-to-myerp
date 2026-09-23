import { prisma } from "@/lib/db";
import { Badge, Hash } from "@/components/Badge";
import { TagForm } from "@/components/TagForm";
import { fmtTime } from "@/lib/format";
import { findPrincipal } from "@/lib/sod";

export const dynamic = "force-dynamic";

export default async function History() {
  const [refs, log, commits] = await Promise.all([
    prisma.ref.findMany({ orderBy: { name: "asc" } }),
    prisma.refLog.findMany({ orderBy: { id: "desc" }, take: 100 }),
    prisma.configCommit.findMany({ orderBy: { committedAt: "desc" }, select: { hash: true, parents: true, authorId: true, message: true, committedAt: true } }),
  ]);
  const name = (id: string) => findPrincipal(id)?.displayName ?? id;
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">History</h1>
        <p className="text-sm text-[var(--muted)]">Refs are the only mutable thing. Every move of every ref is appended to a permanent log with who and why; Git&apos;s reflog is local and expires, which is the wrong shape for finance.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="panel overflow-x-auto">
          <div className="px-4 pt-3 font-semibold flex items-center justify-between">Refs</div>
          <table className="table">
            <thead><tr><th>Name</th><th>Kind</th><th>Commit</th><th>Protected</th></tr></thead>
            <tbody>{refs.map((r) => <tr key={r.name}><td className="hash">{r.name}</td><td>{r.kind}</td><td><Hash value={r.commitHash} /></td><td>{r.protected ? <Badge kind="neutral">protected</Badge> : ""}</td></tr>)}</tbody>
          </table>
          <div className="p-4 border-t border-[var(--line)]"><TagForm /></div>
        </section>
        <section className="panel overflow-x-auto">
          <div className="px-4 pt-3 font-semibold">Commits</div>
          <table className="table">
            <thead><tr><th>Hash</th><th>Parents</th><th>Author</th><th>Message</th><th>When</th></tr></thead>
            <tbody>{commits.map((c) => <tr key={c.hash}><td><Hash value={c.hash} /></td><td className="hash">{c.parents.map((p) => p.slice(0, 8)).join(", ") || "—"}</td><td>{name(c.authorId)}</td><td>{c.message}</td><td className="text-xs text-[var(--muted)]">{fmtTime(c.committedAt)}</td></tr>)}</tbody>
          </table>
        </section>
      </div>
      <section className="panel overflow-x-auto">
        <div className="px-4 pt-3 font-semibold">Ref log <span className="text-xs font-normal text-[var(--muted)]">append-only</span></div>
        <table className="table">
          <thead><tr><th>#</th><th>Ref</th><th>From</th><th>To</th><th>Actor</th><th>Reason</th><th>When</th></tr></thead>
          <tbody>{log.map((l) => <tr key={l.id}><td>{l.id}</td><td className="hash">{l.refName}</td><td><Hash value={l.fromHash} len={8} /></td><td><Hash value={l.toHash} len={8} /></td><td>{name(l.actorId)}</td><td>{l.reason}</td><td className="text-xs text-[var(--muted)]">{fmtTime(l.at)}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  );
}
