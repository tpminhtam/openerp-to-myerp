import { handle } from "@/lib/http";
import { verifyChain } from "@/lib/audit";

export async function GET() {
  return handle(async () => verifyChain());
}
