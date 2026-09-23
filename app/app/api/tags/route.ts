import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getActor } from "@/lib/actor";
import { createTag } from "@/lib/vcs";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await req.json();
    await createTag(String(body.name), String(body.at ?? "main"), await getActor(req));
    return { tagged: body.name };
  });
}
