import { authenticate, authorize } from "@/server/auth";
import { ensureProfile, getMe } from "@/server/profiles";
import { handler, ok } from "@/server/api/errors";
export const runtime = "nodejs";
export const GET = handler(async req => { const identity = await authenticate(req); await ensureProfile(identity); return ok(await getMe(await authorize(identity))); });
