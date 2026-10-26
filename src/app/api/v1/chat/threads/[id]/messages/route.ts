import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { authenticate, authorize } from "@/server/auth";
import { assertThread, recordId } from "@/server/business-mutations";
import { ApiError, handler, jsonBody, ok } from "@/server/api/errors";
import { iso, strings } from "@/lib/record-mapping";
import { adminServices } from "@/server/firebase/admin";
export const runtime="nodejs";
const threadId=(req:Request)=>recordId.parse(new URL(req.url).pathname.split("/").at(-2));
export const GET=handler(async req=>{const actor=await authorize(await authenticate(req));const ref=await assertThread(actor,threadId(req));const rows=await ref.collection("messages").orderBy("createdAt","desc").limit(50).get();return ok({items:rows.docs.filter(d=>d.data().salonId===actor.salonId&&d.data().fixture!==true).map(d=>({id:d.id,senderUid:d.data().senderUid,senderRole:d.data().senderRole,text:d.data().text,createdAt:iso(d.data().createdAt)})).reverse()});});
export const POST=handler(async req=>{const actor=await authorize(await authenticate(req));const ref=await assertThread(actor,threadId(req));const input=z.object({id:z.uuid(),text:z.string().trim().min(1).max(4000)}).strict().parse(await jsonBody(req));
 const db=adminServices().db;const messageRef=ref.collection("messages").doc(actor.uid+"_"+input.id);
 await db.runTransaction(async tx=>{const [thread,existing]=await Promise.all([tx.get(ref),tx.get(messageRef)]);const d=thread.data();if(!d||d.salonId!==actor.salonId||d.fixture===true||!strings(d.participantUids).includes(actor.uid))throw new ApiError("FORBIDDEN",403,"Conversación no disponible");
 if(existing.exists){if(existing.data()?.text!==input.text||existing.data()?.senderUid!==actor.uid)throw new ApiError("CONFLICT",409,"Identificador de envío ya utilizado");return;}
 tx.create(messageRef,{salonId:actor.salonId,threadId:ref.id,senderUid:actor.uid,senderRole:actor.role,text:input.text,createdAt:FieldValue.serverTimestamp(),fixture:false});
 tx.update(ref,{lastMessage:input.text,lastMessageAt:FieldValue.serverTimestamp(),lastSenderUid:actor.uid});
 });return ok({id:messageRef.id},201);
});
