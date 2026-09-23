import { handle } from "@/lib/http";
import { prisma } from "@/lib/db";

export async function GET() {
  return handle(async () => ({
    refs: await prisma.ref.findMany({ orderBy: { name: "asc" } }),
    log: await prisma.refLog.findMany({ orderBy: { id: "desc" }, take: 100 }),
    commits: await prisma.configCommit.findMany({ orderBy: { committedAt: "desc" }, select: { hash: true, parents: true, authorId: true, message: true, committedAt: true } }),
  }));
}
