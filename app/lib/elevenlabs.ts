/** ElevenLabs at the two ends of the voice surface only: speech-to-text in, text-to-speech out. */
const BASE = "https://api.elevenlabs.io";
export const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "IKne3meq5aSn9XLyUdCD"; // Charlie
const TTS_MODEL = process.env.ELEVENLABS_TTS_MODEL ?? "eleven_flash_v2_5";
const STT_MODEL = process.env.ELEVENLABS_STT_MODEL ?? "scribe_v1";
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

function key(): string {
  const k = process.env.ELEVENLABS_API_KEY;
  if (!k) throw Object.assign(new Error("ELEVENLABS_API_KEY is not set; voice is unavailable, the typed box still works."), { status: 503 });
  return k;
}

function fail(action: string, status: number, body: string): Error {
  if (status === 401) return Object.assign(new Error(`ElevenLabs rejected the API key while ${action}`), { status: 502 });
  if (status === 429) return Object.assign(new Error(`ElevenLabs quota or rate limit reached while ${action}; type the command instead`), { status: 502 });
  return Object.assign(new Error(`ElevenLabs returned ${status} while ${action}: ${body.slice(0, 200)}`), { status: 502 });
}

export async function transcribe(audio: Blob, filename: string): Promise<string> {
  if (audio.size === 0) throw Object.assign(new Error("The recording was empty. Click, speak, then click again."), { status: 400 });
  if (audio.size > MAX_AUDIO_BYTES) throw Object.assign(new Error("The recording is too long"), { status: 400 });
  const form = new FormData();
  form.append("model_id", STT_MODEL);
  form.append("file", audio, filename);
  const res = await fetch(`${BASE}/v1/speech-to-text`, { method: "POST", headers: { "xi-api-key": key() }, body: form });
  if (!res.ok) throw fail("transcribing", res.status, await res.text());
  const body = (await res.json()) as { text?: string };
  const text = (body.text ?? "").trim();
  if (!text) throw Object.assign(new Error("Nothing was heard in that recording. Check the microphone, or type instead."), { status: 400 });
  return text;
}

export async function speak(text: string): Promise<ArrayBuffer> {
  if (!text.trim()) throw Object.assign(new Error("There is nothing to say"), { status: 400 });
  const res = await fetch(`${BASE}/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": key(), "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: TTS_MODEL }),
  });
  if (!res.ok) throw fail("generating speech", res.status, await res.text());
  return res.arrayBuffer();
}

export async function status(): Promise<{ configured: boolean; used?: number; limit?: number; tier?: string }> {
  if (!process.env.ELEVENLABS_API_KEY) return { configured: false };
  try {
    const res = await fetch(`${BASE}/v1/user/subscription`, { headers: { "xi-api-key": key() }, cache: "no-store" });
    if (!res.ok) return { configured: true };
    const d = (await res.json()) as { character_count?: number; character_limit?: number; tier?: string };
    return { configured: true, used: d.character_count, limit: d.character_limit, tier: d.tier };
  } catch {
    return { configured: true };
  }
}
