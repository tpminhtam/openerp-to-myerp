import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/** Errors become structured JSON; a blocked SOD decision is a 403 that names the rule. */
export async function handle(fn: () => Promise<unknown>) {
  try {
    const result = await fn();
    if (result && typeof result === "object" && "blocked" in result && (result as { blocked: boolean }).blocked) {
      return NextResponse.json({ ...(result as object), error: (result as { decision?: { message?: string } }).decision?.message }, { status: 403 });
    }
    return NextResponse.json(result);
  } catch (e) {
    const err = e as Error & { status?: number };
    return NextResponse.json({ error: err.message }, { status: err.status ?? 400 });
  }
}
