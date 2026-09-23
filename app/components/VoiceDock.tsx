"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "recording" | "transcribing" | "thinking" | "speaking";
type Reply = { heard: string; action: string; reply: string; spoken: string; number?: string; navigate?: string; refusal?: { ruleId?: string; message?: string }; grounded?: boolean };

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const m of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg"]) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
}

export function VoiceDock() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [reply, setReply] = useState<Reply | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<string>("");
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const ctx = useRef<AudioContext | null>(null);
  const lastBuffer = useRef<AudioBuffer | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const [canReplay, setCanReplay] = useState(false);
  const contextNumber = /\/changes\/(CR-\d+)/.exec(pathname ?? "")?.[1];

  useEffect(() => {
    if (!open) return;
    fetch("/api/voice/status").then((r) => r.json()).then((s) => setQuota(s.configured ? (s.limit ? `voice ready · ${(s.limit - s.used).toLocaleString()} characters left` : "voice ready") : "voice not configured: type instead")).catch(() => setQuota(""));
  }, [open]);

  /** Safari only lets audio play after a user gesture: create and resume one AudioContext on a click, then reuse it. */
  function unlockAudio() {
    if (!ctx.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx.current = new AC();
      const buf = ctx.current.createBuffer(1, 1, 22050);
      const src = ctx.current.createBufferSource();
      src.buffer = buf; src.connect(ctx.current.destination); src.start(0);
    }
    if (ctx.current.state === "suspended") ctx.current.resume().catch(() => {});
  }

  function play(buffer: AudioBuffer) {
    const c = ctx.current!;
    source.current?.stop();
    const src = c.createBufferSource();
    src.buffer = buffer; src.connect(c.destination);
    src.onended = () => setPhase((p) => (p === "speaking" ? "idle" : p));
    source.current = src;
    setPhase("speaking");
    src.start(0);
  }

  async function startRecording() {
    unlockAudio(); setError(null); setReply(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = rec.mimeType || mime || "audio/webm";
        const blob = new Blob(chunks.current, { type });
        await sendAudio(blob, type.includes("mp4") ? "turn.mp4" : type.includes("mpeg") ? "turn.mp3" : "turn.webm");
      };
      recorder.current = rec;
      rec.start();
      setPhase("recording");
    } catch {
      setError("Microphone blocked. Allow it in the browser, or type the command below.");
      setPhase("idle");
    }
  }

  function stopRecording() {
    recorder.current?.stop();
    setPhase("transcribing");
  }

  async function sendAudio(blob: Blob, name: string) {
    const form = new FormData();
    form.append("audio", blob, name);
    const res = await fetch("/api/voice/transcribe", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setError(data.error ?? `Transcription failed (${res.status})`); setPhase("idle"); return; }
    await runCommand(data.text);
  }

  async function runCommand(text: string) {
    unlockAudio();
    setPhase("thinking"); setError(null);
    setReply({ heard: text, action: "", reply: "", spoken: "" });
    const res = await fetch("/api/voice/command", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, number: contextNumber }) });
    const data = (await res.json().catch(() => ({}))) as Reply & { error?: string };
    if (!res.ok) { setError(data.error ?? `HTTP ${res.status}`); setPhase("idle"); return; }
    setReply(data);
    if (data.navigate && data.navigate !== pathname) router.push(data.navigate); else router.refresh();
    await say(data.spoken);
  }

  async function say(text: string) {
    if (!text) { setPhase("idle"); return; }
    setPhase("speaking");
    try {
      const res = await fetch("/api/voice/speak", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Speech unavailable; the answer is on screen."); setPhase("idle"); return; }
      unlockAudio();
      const decoded = await ctx.current!.decodeAudioData(await res.arrayBuffer());
      lastBuffer.current = decoded;
      setCanReplay(true);
      play(decoded);
    } catch {
      setPhase("idle");
    }
  }

  function replay() {
    unlockAudio();
    if (lastBuffer.current) play(lastBuffer.current);
  }

  const busy = phase === "transcribing" || phase === "thinking";
  const label = { idle: "Click and speak", recording: "Listening… click to send", transcribing: "Transcribing…", thinking: "Claude is working…", speaking: "Speaking…" }[phase];

  return (
    <>
      {!open && (
        <button onClick={() => { unlockAudio(); setOpen(true); }} className="fixed bottom-5 right-5 z-30 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg" style={{ background: "#d97757" }}>
          🎙 Talk to Claude
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-30 w-[min(420px,calc(100vw-40px))] rounded-xl border border-[var(--line)] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-2">
            <div>
              <div className="text-sm font-semibold">Claude · voice</div>
              <div className="text-[11px] text-[var(--muted)]">Acts as Claude (AI agent), under the same rules. Nothing is spoken until verified.</div>
            </div>
            <button className="text-[var(--muted)] text-lg leading-none px-2" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <button
              disabled={busy || phase === "speaking"}
              onClick={() => (phase === "recording" ? stopRecording() : startRecording())}
              className="w-full rounded-lg py-4 text-base font-semibold text-white transition disabled:opacity-60"
              style={{ background: phase === "recording" ? "#b91c1c" : "#d97757" }}
            >
              {phase === "recording" ? "● " : "🎙 "}{label}
            </button>
            <form onSubmit={(e) => { e.preventDefault(); if (typed.trim()) { runCommand(typed.trim()); setTyped(""); } }} className="flex gap-2">
              <input className="input flex-1" placeholder="…or type: raise Sale VAT to 16% from 1 October" value={typed} onChange={(e) => setTyped(e.target.value)} disabled={busy} />
              <button className="btn" disabled={busy || !typed.trim()}>Send</button>
            </form>
            {contextNumber && <div className="text-[11px] text-[var(--muted)]">Context: {contextNumber}. Try “explain this change”, “what does it move?”, “merge it”.</div>}
            {!contextNumber && <div className="text-[11px] text-[var(--muted)]">Try “raise Sale VAT to 16 percent from October first”, “are the books balanced?”, “is the audit chain intact?”.</div>}
            {reply?.heard && <div className="text-sm"><span className="text-[var(--muted)]">You said: </span>“{reply.heard}”</div>}
            {reply?.reply && (
              <div className={reply.refusal ? "amber-box" : "green-box"}>
                {reply.refusal && <div className="font-semibold mb-1">Refused by {reply.refusal.ruleId}</div>}
                <div className="text-sm whitespace-pre-line">{reply.reply}</div>
                {reply.grounded === true && <div className="mt-2"><span className="badge badge-success">figures verified before speaking</span></div>}
              </div>
            )}
            {error && <div className="red-box text-sm">{error}</div>}
            <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
              <span>{quota}</span>
              {canReplay && <button className="underline" onClick={replay}>Replay</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
