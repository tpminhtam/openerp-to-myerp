import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getActor } from "@/lib/actor";
import { merge } from "@/lib/changes";

export async function POST(req: NextRequest, ctx: { params: Promise<{ number: string }> }) {
  return handle(async () => merge((await ctx.params).number, await getActor(req)));
}
