"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Principal } from "@/lib/sod";

export function PersonaSwitcher({ principals, current }: { principals: Principal[]; current: Principal }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden sm:inline text-[var(--muted)]">Acting as</span>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: current.color, display: "inline-block" }} />
      <select
        className="select"
        style={{ width: "auto", minWidth: 180 }}
        value={current.id}
        disabled={pending}
        onChange={(e) => {
          document.cookie = `actor=${e.target.value}; path=/`;
          start(() => router.refresh());
        }}
      >
        {principals.map((p) => (
          <option key={p.id} value={p.id}>{p.displayName} · {p.title}</option>
        ))}
      </select>
    </label>
  );
}
