"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TagForm() {
  const router = useRouter();
  const [name, setName] = useState("filed-2026-08");
  const [msg, setMsg] = useState<string | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tags", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, at: "main" }) });
    const data = await res.json().catch(() => ({}));
    setMsg(res.ok ? `Tagged main as ${name}. Tags never move.` : data.error ?? "failed");
    router.refresh();
  }
  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <div><label className="label">Tag main as</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} style={{ width: 200 }} /></div>
      <button className="btn" type="submit">Create tag</button>
      {msg && <span className="text-xs text-[var(--muted)]">{msg}</span>}
    </form>
  );
}
