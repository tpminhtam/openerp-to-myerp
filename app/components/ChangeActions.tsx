"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Msg = { tone: "amber" | "green" | "red"; text: string; rule?: string };

export function ChangeActions({ number, status, actorName, mergeable, reasons }: { number: string; status: string; actorName: string; mergeable: boolean; reasons: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<Msg | null>(null);

  async function call(label: string, path: string, body?: object, headers?: Record<string, string>) {
    setBusy(label); setMsg(null);
    const res = await fetch(`/api/changes/${number}/${path}`, { method: "POST", headers: { "content-type": "application/json", ...(headers ?? {}) }, body: JSON.stringify(body ?? {}) });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.status === 403 && data.decision) setMsg({ tone: "amber", rule: data.decision.ruleId, text: data.decision.message });
    else if (!res.ok) setMsg({ tone: "red", text: data.error ?? `HTTP ${res.status}` });
    else if (data.merged) setMsg({ tone: "green", text: `Merged. main is now ${String(data.commit).slice(0, 12)}. The change is in force.` });
    else if (data.checks) setMsg({ tone: data.checks.every((c: { conclusion: string }) => c.conclusion === "success") ? "green" : "amber", text: data.checks.map((c: { name: string; conclusion: string; summary: string }) => `${c.name}: ${c.conclusion} — ${c.summary}`).join(" · ") });
    else if (data.review) setMsg({ tone: "green", text: `${actorName} ${data.review.state === "approved" ? "approved" : "requested changes on"} ${number}.` });
    else setMsg({ tone: "green", text: "Done." });
    router.refresh();
  }

  const open = status === "open";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 items-center">
        <button className="btn" disabled={!open || !!busy} onClick={() => call("checks", "checks")}>{busy === "checks" ? "Running…" : "Run checks"}</button>
        <button className="btn" disabled={!open || !!busy} onClick={() => call("approve", "reviews", { state: "approved" })}>Approve as {actorName}</button>
        <button className="btn" disabled={!open || !!busy} onClick={() => call("changes", "reviews", { state: "changes_requested" })}>Request changes</button>
        <button className="btn btn-primary" disabled={!open || !!busy} title={mergeable ? "" : reasons.join("; ")} onClick={() => call("merge", "merge")}>{busy === "merge" ? "Merging…" : `Merge as ${actorName}`}</button>
        <button className="btn btn-danger" disabled={!open || !!busy} onClick={() => call("close", "close")}>Close</button>
        {!mergeable && open && <span className="text-xs text-[var(--muted)]">not mergeable yet: {reasons.join("; ")}</span>}
      </div>
      {msg && (
        <div className={msg.tone === "amber" ? "amber-box" : msg.tone === "green" ? "green-box" : "red-box"}>
          {msg.rule && <div className="font-semibold mb-1">Refused by {msg.rule}</div>}
          <div className="text-sm">{msg.text}</div>
        </div>
      )}
    </div>
  );
}

export function ClaudePanel({ number, status }: { number: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ note: string; grounded: boolean; ungrounded: string[]; figuresChecked: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refusal, setRefusal] = useState<{ rule?: string; text: string } | null>(null);

  async function explain() {
    setBusy("explain"); setError(null); setNote(null);
    const res = await fetch("/api/agent/explain", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ number }) });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) { setError(data.error ?? `HTTP ${res.status}`); return; }
    setNote(data);
  }

  async function merge() {
    setBusy("merge"); setError(null); setRefusal(null);
    const res = await fetch(`/api/changes/${number}/merge`, { method: "POST", headers: { "content-type": "application/json", "X-Actor": "claude" }, body: "{}" });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.status === 403 && data.decision) setRefusal({ rule: data.decision.ruleId, text: data.decision.message });
    else if (!res.ok) setError(data.error ?? `HTTP ${res.status}`);
    else setRefusal({ text: "Merged?! That should never happen: the control failed." });
    router.refresh();
  }

  return (
    <div className="panel p-4 flex flex-col gap-3" style={{ borderColor: "#e9c9b8" }}>
      <div>
        <h2 className="font-semibold">Claude <span className="badge" style={{ background: "#fbe9df", color: "#a34a2a" }}>AI agent · principal “claude”</span></h2>
        <p className="text-xs text-[var(--muted)]">The agent reads the diff and the impact result through the same API a person uses. Every figure in its note is checked against the impact result before it is shown. It can explain and propose; the rules refuse it from merging.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn" disabled={!!busy} onClick={explain}>{busy === "explain" ? "Claude is reading…" : "Explain this change"}</button>
        <button className="btn" disabled={!!busy || status !== "open"} onClick={merge}>{busy === "merge" ? "Trying…" : "Ask Claude to merge"}</button>
      </div>
      {note && (
        <div className="panel p-3 bg-[#fdfaf7]">
          <div className="text-sm whitespace-pre-wrap">{note.note}</div>
          <div className="mt-2">
            {note.grounded ? <span className="badge badge-success">verified · {note.figuresChecked} figures checked against the impact result</span>
              : <span className="badge badge-blocked">ungrounded: {note.ungrounded.join(", ")}</span>}
          </div>
        </div>
      )}
      {refusal && (
        <div className="amber-box">
          {refusal.rule && <div className="font-semibold mb-1">Refused by {refusal.rule} · stored as a blocked review and an audit row</div>}
          <div className="text-sm">{refusal.text}</div>
        </div>
      )}
      {error && <div className="red-box text-sm">{error}</div>}
    </div>
  );
}
