import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getActor } from "@/lib/actor";
import { createBranch } from "@/lib/vcs";
import { prisma } from "@/lib/db";

export async function GET() {
  return handle(async () => prisma.ref.findMany({ orderBy: { name: "asc" } }));
}

export async function POST(req: NextRequest) {
  return handle(async () => {
    const actor = await getActor(req);
    const body = await req.json();
    const at = await createBranch(String(body.name), String(body.from ?? "main"), actor);
    return { name: body.name, commit: at };
  });
}
