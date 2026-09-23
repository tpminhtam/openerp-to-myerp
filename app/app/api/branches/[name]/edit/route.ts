import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { getActor } from "@/lib/actor";
import { applyEdit } from "@/lib/config";
import { commitOnBranch, head, treeAt } from "@/lib/vcs";

/** One edit by path, committed: the editor's one-field write. Body: { path, value, message? } or { edits: [{path, value}], message? } */
export async function POST(req: NextRequest, ctx: { params: Promise<{ name: string }> }) {
  return handle(async () => {
    const { name } = await ctx.params;
    const actor = await getActor(req);
    const body = await req.json();
    const edits: { path: string; value: unknown }[] = body.edits ?? [{ path: body.path, value: body.value }];
    let tree = await treeAt(await head(name));
    for (const e of edits) tree = applyEdit(tree, e.path, e.value);
    const message = body.message ?? edits.map((e) => `${e.path} → ${JSON.stringify(e.value)}`).join("; ");
    const c = await commitOnBranch(name, tree, actor, message);
    return { branch: name, commit: c.hash, message };
  });
}
