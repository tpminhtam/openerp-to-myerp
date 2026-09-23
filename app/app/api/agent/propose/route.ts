import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { proposeFromText } from "@/lib/agent";

/** Body: { text }. Claude turns plain English into a validated change request opened as the `claude` principal. */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await req.json();
    if (!body.text || String(body.text).trim().length < 5) throw Object.assign(new Error("Say what should change, e.g. 'raise Sale VAT to 16% from 1 October 2026'"), { status: 400 });
    return proposeFromText(String(body.text));
  });
}
