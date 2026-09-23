import { handle } from "@/lib/http";
import { status } from "@/lib/elevenlabs";

export async function GET() {
  return handle(async () => status());
}
