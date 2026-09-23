import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { handleVoice } from "@/lib/voice";

export const maxDuration = 60;

/** Body: { text, number? }. Runs one governed action as Claude and returns what to show and what to say. */
export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await req.json();
    if (!body.text || String(body.text).trim().length < 2) throw Object.assign(new Error("Say or type a command"), { status: 400 });
    const reply = await handleVoice(String(body.text), body.number ? String(body.number) : undefined);
    return reply.blocked ? { ...reply, blocked: undefined, refusal: reply.blocked } : reply;
  });
}
