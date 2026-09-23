import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getRequest } from "@/lib/changes";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ number: string }> }) {
  return handle(async () => getRequest((await ctx.params).number));
}
