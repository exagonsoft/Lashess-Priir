import { authenticate, authorize } from "@/server/auth";
import { getMe, profilePatch, updateProfile } from "@/server/profiles";
import { handler, jsonBody, ok } from "@/server/api/errors";
export const runtime = "nodejs";
export const GET = handler(async req => ok(await getMe(await authorize(await authenticate(req)))));
export const PATCH = handler(async req => { const actor = await authorize(await authenticate(req)); const input = profilePatch.parse(await jsonBody(req)); return ok(await updateProfile(actor, input)); });
