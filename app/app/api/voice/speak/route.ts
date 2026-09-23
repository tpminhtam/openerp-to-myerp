import { NextRequest, NextResponse } from "next/server";
import { speak } from "@/lib/elevenlabs";

export const maxDuration = 30;

/** Body: { text } (already sanitised by the command route). Returns audio/mpeg. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const audio = await speak(String(body.text ?? "").slice(0, 800));
    return new NextResponse(audio, { headers: { "content-type": "audio/mpeg", "cache-control": "no-store" } });
  } catch (e) {
    const err = e as Error & { status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status ?? 502 });
  }
}
