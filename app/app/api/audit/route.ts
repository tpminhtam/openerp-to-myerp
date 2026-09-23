import { handle } from "@/lib/http";
import { prisma } from "@/lib/db";

export async function GET() {
  return handle(async () => prisma.auditLog.findMany({ orderBy: { id: "desc" }, take: 200 }));
}
