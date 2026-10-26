import { authenticate, authorize } from "@/server/auth";
import { adminServices } from "@/server/firebase/admin";
import { handler, ok } from "@/server/api/errors";
export const runtime = "nodejs";
export const GET = handler(async req => { const actor = await authorize(await authenticate(req)); const s = (await adminServices().db.doc("salons/" + actor.salonId).get()).data()!; return ok({ id: actor.salonId, name: s.name, currency: s.currency, timezone: s.timezone }); });
