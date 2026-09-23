import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getActor } from "@/lib/actor";
import { runChecks } from "@/lib/changes";

export async function POST(req: NextRequest, ctx: { params: Promise<{ number: string }> }) {
  return handle(async () => runChecks((await ctx.params).number, await getActor(req)));
}
