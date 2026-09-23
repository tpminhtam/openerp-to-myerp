import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { explainRequest } from "@/lib/agent";

/** Body: { number }. A review note whose every figure is checked against the impact result before it is returned. */
export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await req.json();
    return explainRequest(String(body.number));
  });
}
