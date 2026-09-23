import { cookies } from "next/headers";
import { findPrincipal, type Principal } from "./sod";

/** The acting principal: the X-Actor header wins (agents and external tools), else the persona cookie, else Tam. */
export async function getActor(req?: Request): Promise<Principal> {
  const fromHeader = req?.headers.get("x-actor");
  if (fromHeader) {
    const p = findPrincipal(fromHeader);
    if (!p) throw Object.assign(new Error(`Unknown principal '${fromHeader}'`), { status: 400 });
    return p;
  }
  const jar = await cookies();
  return findPrincipal(jar.get("actor")?.value) ?? findPrincipal("tam.tran")!;
}
