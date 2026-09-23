import { createHash } from "node:crypto";

/** Canonical JSON: sorted keys, no whitespace, so the same content always hashes the same. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((k) => [k, sortKeys((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

export function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/** Git's framing: `<kind> <length>\0<payload>`, so a tree can never collide with a commit. */
export function hashObject(kind: "tree" | "commit", payload: string): string {
  return sha256(`${kind} ${Buffer.byteLength(payload)}\0${payload}`);
}
