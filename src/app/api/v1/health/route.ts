import { ok } from "@/server/api/errors";
export const runtime = "nodejs";
export async function GET() { return ok({ status: "ok", service: "lashess-priir", version: "v1", check: "liveness" }); }
