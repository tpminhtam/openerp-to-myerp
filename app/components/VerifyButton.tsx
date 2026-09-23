"use client";
import { useState } from "react";

export function VerifyButton() {
  const [result, setResult] = useState<{ ok: boolean; rows: number; brokenAt?: number } | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button className="btn" disabled={busy} onClick={async () => { setBusy(true); const r = await fetch("/api/audit/verify"); setResult(await r.json()); setBusy(false); }}>{busy ? "Verifying…" : "Verify chain"}</button>
      {result && (result.ok ? <span className="badge badge-success">chain verified · {result.rows} rows</span> : <span className="badge badge-failure">broken at row {result.brokenAt} of {result.rows}</span>)}
    </div>
  );
}
