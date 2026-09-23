import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { prisma } from "@/lib/db";
import { seed } from "@/lib/seed";

/** Restore the untouched demo state. Guarded by RESET_TOKEN when set (always allowed in development). */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return handle(async () => {
    const token = process.env.RESET_TOKEN;
    const given = req.headers.get("x-reset-token") ?? req.nextUrl.searchParams.get("token");
    if (token && given !== token) throw Object.assign(new Error("reset token required"), { status: 403 });
    return { reset: await seed(prisma) };
  });
}
