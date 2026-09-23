import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { transcribe } from "@/lib/elevenlabs";

export const maxDuration = 60;

/** multipart/form-data with an `audio` file (Safari sends audio/mp4, Chrome audio/webm). */
export async function POST(req: NextRequest) {
  return handle(async () => {
    const form = await req.formData();
    const audio = form.get("audio");
    if (!(audio instanceof Blob)) throw Object.assign(new Error("No audio in the request"), { status: 400 });
    const name = (audio as File).name || (audio.type.includes("mp4") ? "turn.mp4" : "turn.webm");
    return { text: await transcribe(audio, name) };
  });
}
