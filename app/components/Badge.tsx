export function Badge({ kind, children }: { kind: "success" | "failure" | "blocked" | "stale" | "neutral"; children: React.ReactNode }) {
  return <span className={`badge badge-${kind}`}>{children}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const kind = status === "merged" || status === "posted" || status === "paid" || status === "approved" ? "success"
    : status === "closed" || status === "draft" ? "stale"
    : status === "blocked" || status === "changes_requested" ? "blocked"
    : status === "failure" ? "failure" : "neutral";
  return <Badge kind={kind}>{status.replace("_", " ")}</Badge>;
}

export function Hash({ value, len = 12 }: { value: string | null | undefined; len?: number }) {
  if (!value) return <span className="hash">—</span>;
  return <span className="hash" title={value}>{value.slice(0, len)}</span>;
}

export function Dot({ conclusion }: { conclusion?: string | null }) {
  const color = conclusion === "success" ? "#1f9d55" : conclusion === "failure" ? "#d13c3c" : "#c8c4bb";
  return <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, background: color, marginRight: 4 }} title={conclusion ?? "not run"} />;
}
