"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TaxDef } from "@/lib/tax";

const FIELDS = ["amount", "name", "active", "sequence", "priceInclude", "includeBaseAmount"] as const;

export function ProposeForms({ taxes, actorId }: { taxes: TaxDef[]; actorId: string }) {
  const router = useRouter();
  const [tax, setTax] = useState(taxes[0]?.code ?? "");
  const [field, setField] = useState<(typeof FIELDS)[number]>("amount");
  const [value, setValue] = useState("0.16");
  const [title, setTitle] = useState("");
  const [effective, setEffective] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("Raise Sale VAT 15% to 16% from 1 October 2026");
  const [agentBusy, setAgentBusy] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  function parsed(): unknown {
    if (field === "active" || field === "priceInclude" || field === "includeBaseAmount") return value.trim().toLowerCase() === "true";
    if (field === "sequence") return parseInt(value, 10);
    return value.trim();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const branch = `${actorId}/${tax.toLowerCase()}-${field.toLowerCase()}-${Date.now().toString(36)}`;
    const body = { branch, title: title || `${tax} ${field} → ${value}`, edits: [{ path: `taxes.${tax}.${field}`, value: parsed() }], effectiveFrom: effective || undefined };
    const res = await fetch("/api/changes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "failed"); return; }
    router.push(`/changes/${data.number}`);
  }

  async function propose() {
    setAgentBusy(true); setAgentError(null);
    const res = await fetch("/api/agent/propose", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    setAgentBusy(false);
    if (!res.ok || !data.number) { setAgentError(data.error ?? "Claude could not turn that into a change"); return; }
    router.push(`/changes/${data.number}`);
  }

  const current = taxes.find((t) => t.code === tax);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <form onSubmit={submit} className="panel p-4 flex flex-col gap-3">
        <div>
          <h2 className="font-semibold">Propose a change</h2>
          <p className="text-xs text-[var(--muted)]">Creates a branch from main, commits the edit, and opens a change request. Nothing is in force until it is reviewed and merged.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Tax</label>
            <select className="select" value={tax} onChange={(e) => setTax(e.target.value)}>{taxes.map((t) => <option key={t.code} value={t.code}>{t.code} · {t.name}</option>)}</select></div>
          <div><label className="label">Field</label>
            <select className="select" value={field} onChange={(e) => { const f = e.target.value as (typeof FIELDS)[number]; setField(f); const cur = current ? (current as unknown as Record<string, unknown>)[f] : ""; setValue(String(cur ?? "")); }}>{FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
          <div><label className="label">New value</label><input className="input" value={value} onChange={(e) => setValue(e.target.value)} placeholder={field === "amount" ? "0.16" : ""} /></div>
          <div><label className="label">Effective from (optional)</label><input className="input" type="date" value={effective} onChange={(e) => setEffective(e.target.value)} /></div>
        </div>
        <div><label className="label">Title</label><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`${tax} ${field} → ${value}`} /></div>
        {current && <div className="text-xs text-[var(--muted)]">Current {field}: <span className="hash">{String((current as unknown as Record<string, unknown>)[field])}</span></div>}
        {error && <div className="red-box text-sm">{error}</div>}
        <div><button className="btn btn-primary" disabled={busy} type="submit">{busy ? "Opening…" : "Open change request"}</button></div>
      </form>
      <div className="panel p-4 flex flex-col gap-3">
        <div>
          <h2 className="font-semibold">Propose in plain English <span className="badge badge-neutral">Claude</span></h2>
          <p className="text-xs text-[var(--muted)]">Claude turns the sentence into a validated edit and opens the change request as itself. It can propose; it cannot approve or merge.</p>
        </div>
        <textarea className="textarea" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        {agentError && <div className="red-box text-sm">{agentError}</div>}
        <div><button className="btn btn-primary" disabled={agentBusy} onClick={propose}>{agentBusy ? "Claude is drafting…" : "Ask Claude to propose"}</button></div>
      </div>
    </div>
  );
}
