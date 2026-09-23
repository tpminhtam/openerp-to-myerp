import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { head, treeAt } from "@/lib/vcs";

export async function GET(req: NextRequest) {
  return handle(async () => {
    const ref = req.nextUrl.searchParams.get("ref") ?? "main";
    const commit = await head(ref);
    return { ref, commit, tree: await treeAt(commit) };
  });
}
