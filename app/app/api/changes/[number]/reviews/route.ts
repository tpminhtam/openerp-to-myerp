import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getActor } from "@/lib/actor";
import { review } from "@/lib/changes";

/** Body: { state: "approved" | "changes_requested", note? }. A refused approval returns 403 with the rule. */
export async function POST(req: NextRequest, ctx: { params: Promise<{ number: string }> }) {
  return handle(async () => {
    const body = await req.json();
    return review((await ctx.params).number, await getActor(req), body.state, body.note);
  });
}
