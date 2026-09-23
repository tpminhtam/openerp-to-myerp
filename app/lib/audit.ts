/** Hash-chained, append-only audit log. Each row hashes the previous row's hash plus its own canonical content. */
import { prisma } from "./db";
import { canonicalJson, sha256 } from "./canonical";
import type { Principal } from "./sod";

export async function audit(actor: Principal, action: string, objectType: string, objectId: string, summary: string, payload: object = {}) {
  const last = await prisma.auditLog.findFirst({ orderBy: { id: "desc" } });
  const prevHash = last?.hash ?? "0".repeat(64);
  const at = new Date();
  const body = canonicalJson({ at: at.toISOString(), actorId: actor.id, action, objectType, objectId, summary, payload });
  const hash = sha256(prevHash + body);
  return prisma.auditLog.create({ data: { at, actorId: actor.id, action, objectType, objectId, summary, payload: payload as object, prevHash, hash } });
}

export async function verifyChain(): Promise<{ ok: boolean; rows: number; brokenAt?: number }> {
  const rows = await prisma.auditLog.findMany({ orderBy: { id: "asc" } });
  let prev = "0".repeat(64);
  for (const r of rows) {
    const body = canonicalJson({ at: r.at.toISOString(), actorId: r.actorId, action: r.action, objectType: r.objectType, objectId: r.objectId, summary: r.summary, payload: r.payload });
    if (r.prevHash !== prev || r.hash !== sha256(prev + body)) return { ok: false, rows: rows.length, brokenAt: r.id };
    prev = r.hash;
  }
  return { ok: true, rows: rows.length };
}
