import { NextRequest } from "next/server";
import { handle } from "@/lib/http";
import { loadReplayInvoices } from "@/lib/changes";
import { replay } from "@/lib/replay";
import { head, treeAt } from "@/lib/vcs";

/** What-if without a branch: replay main against a ref (or the same ref for the parity check). */
export async function GET(req: NextRequest) {
  return handle(async () => {
    const base = req.nextUrl.searchParams.get("base") ?? "main";
    const target = req.nextUrl.searchParams.get("head") ?? base;
    return replay(await treeAt(await head(base)), await treeAt(await head(target)), await loadReplayInvoices());
  });
}
