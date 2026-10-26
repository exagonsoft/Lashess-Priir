import "server-only";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminServices } from "./firebase/admin";
import { authenticate, authorize, type Actor } from "./auth";
import { ApiError, handler, jsonBody, ok } from "./api/errors";
import { genuineReview, strings } from "@/lib/record-mapping";
export const recordId=z.string().regex(/^[a-zA-Z0-9_-]{1,128}$/);
const schemas={
 customers:z.object({name:z.string().trim().min(1).max(120),email:z.email().or(z.literal("")),phone:z.string().max(40),tags:z.array(z.string().max(40)).max(20)}).strict(),
 products:z.object({name:z.string().trim().min(1).max(160),sku:z.string().max(80),category:z.string().max(80),brand:z.string().max(80),minStock:z.number().nonnegative().max(100000)}).strict(),
 suppliers:z.object({name:z.string().trim().min(1).max(160),contact:z.string().max(120),phone:z.string().max(40),email:z.email().or(z.literal(""))}).strict(),
 reviews:z.object({response:z.string().trim().max(4000),status:z.enum(["Nueva","Publicada","Reportada"])}).strict(),
};
export function editRecord(collection:keyof typeof schemas){return handler(async req=>{
 const actor=await authorize(await authenticate(req),collection==="customers"?["owner","admin","receptionist"]:["owner","admin"]);
 const id=recordId.parse(new URL(req.url).pathname.split("/").at(-1));const patch=schemas[collection].parse(await jsonBody(req));
 const db=adminServices().db;const ref=db.doc("salons/"+actor.salonId+"/"+collection+"/"+id);
 await db.runTransaction(async tx=>{const doc=await tx.get(ref);const data=doc.data();if(!data||data.salonId!==actor.salonId)throw new ApiError("NOT_FOUND",404,"Registro no encontrado");
 if(data.fixture===true)throw new ApiError("CONFLICT",409,"Los registros de muestra son de solo lectura");
 if(collection==="reviews" && "status" in patch && patch.status==="Publicada"){
  const aid=recordId.safeParse(data.appointmentId);if(!aid.success)throw new ApiError("CONFLICT",409,"La opinión requiere una cita completada verificable");
  const appointment=(await tx.get(db.doc("salons/"+actor.salonId+"/appointments/"+aid.data))).data();
  if(!genuineReview({...data,published:true},appointment,actor.salonId))throw new ApiError("CONFLICT",409,"La opinión no cumple los requisitos de publicación");
 }
 const updates:Record<string,unknown>={...patch,updatedAt:FieldValue.serverTimestamp()};if(collection==="customers")updates.displayName=(patch as {name:string}).name;
 if(collection==="reviews")updates.published=(patch as {status:string}).status==="Publicada";
 tx.update(ref,updates);tx.create(db.collection("salons/"+actor.salonId+"/auditLogs").doc(),{salonId:actor.salonId,actorUid:actor.uid,action:"update."+collection,resourcePath:ref.path,createdAt:FieldValue.serverTimestamp()});
 });return ok({saved:true});
});}
export async function assertThread(actor:Actor,id:string){const ref=adminServices().db.doc("salons/"+actor.salonId+"/chatThreads/"+recordId.parse(id));const doc=await ref.get();const d=doc.data();if(!d||d.salonId!==actor.salonId||!strings(d.participantUids).includes(actor.uid)||d.fixture===true)throw new ApiError("FORBIDDEN",403,"No tenés acceso a esta conversación");return ref;}
export const notificationRead=handler(async req=>{const actor=await authorize(await authenticate(req));const id=recordId.parse(new URL(req.url).pathname.split("/").at(-1));z.object({read:z.literal(true)}).strict().parse(await jsonBody(req));const db=adminServices().db;const ref=db.doc("salons/"+actor.salonId+"/notifications/"+id);await db.runTransaction(async tx=>{const d=(await tx.get(ref)).data();if(!d||d.salonId!==actor.salonId||d.recipientUid!==actor.uid||d.fixture===true)throw new ApiError("FORBIDDEN",403,"Notificación no disponible");tx.update(ref,{read:true,readAt:FieldValue.serverTimestamp()});});return ok({read:true});});
