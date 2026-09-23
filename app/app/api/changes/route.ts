import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getActor } from "@/lib/actor";
import { openRequest, proposeEdit } from "@/lib/changes";
import { prisma } from "@/lib/db";

export async function GET() {
  return handle(async () => prisma.changeRequest.findMany({ orderBy: { openedAt: "desc" }, include: { checks: { orderBy: { id: "desc" } }, reviews: true } }));
}

/** Body: { sourceRef, title, body?, effectiveFrom? } to open from an existing branch, or { branch, title, edits: [{path, value}], body?, effectiveFrom? } to branch + edit + commit + open in one call. */
export async function POST(req: NextRequest) {
  return handle(async () => {
    const actor = await getActor(req);
    const body = await req.json();
    if (body.edits) return proposeEdit({ branch: String(body.branch), title: String(body.title), body: body.body, edits: body.edits, effectiveFrom: body.effectiveFrom, actor });
    return openRequest({ sourceRef: String(body.sourceRef), title: String(body.title), body: body.body, effectiveFrom: body.effectiveFrom, actor });
  });
}
