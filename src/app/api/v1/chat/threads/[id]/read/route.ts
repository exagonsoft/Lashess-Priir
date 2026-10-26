import { FieldValue } from "firebase-admin/firestore";
import { authenticate, authorize } from "@/server/auth";
import { assertThread, recordId } from "@/server/business-mutations";
import { handler, ok } from "@/server/api/errors";
export const runtime="nodejs";
export const POST=handler(async req=>{const actor=await authorize(await authenticate(req));const id=recordId.parse(new URL(req.url).pathname.split("/").at(-2));const thread=await assertThread(actor,id);await thread.collection("reads").doc(actor.uid).set({salonId:actor.salonId,uid:actor.uid,readAt:FieldValue.serverTimestamp()});return ok({read:true});});
