import "server-only";
import { FieldPath, type Query } from "firebase-admin/firestore";
import { z } from "zod";
import { adminServices } from "./firebase/admin";
import { authenticate, authorize, salonId, type Actor } from "./auth";
import { ApiError, handler, ok } from "./api/errors";
import { collections, type DataPage, type Resource } from "@/types/integration";
import { genuineReview, mapRecord, strings, text, type Stored } from "@/lib/record-mapping";
const operational=["owner","admin","receptionist"];
export const readOptions=z.object({limit:z.coerce.number().int().min(1).max(50).default(25),cursor:z.string().regex(/^[A-Za-z0-9_-]{1,128}$/).optional(),status:z.string().max(40).optional(),stylistId:z.string().regex(/^[A-Za-z0-9_-]{1,128}$/).optional()});
export { allowedResource } from "@/lib/data-access";
import { allowedResource } from "@/lib/data-access";
export async function listRecords<R extends Resource>(resource:R,options:z.infer<typeof readOptions>,actor?:Actor,selector?:string):Promise<DataPage<R>> {
 const id=actor?.salonId??salonId(); const db=adminServices().db;
 if(!actor && !["SERVICES","STYLISTS","REVIEWS"].includes(resource))throw new ApiError("UNAUTHENTICATED",401,"Iniciá sesión");
 if(actor&&!allowedResource(resource,actor.role))throw new ApiError("FORBIDDEN",403,"No tenés permiso para esta sección");
 if(!actor){const salon=await db.doc("salons/"+id).get();if(salon.data()?.active!==true)throw new ApiError("NOT_FOUND",404,"Salón no disponible");}
 let query:Query=db.collection("salons/"+id+"/"+collections[resource]);
 if(selector){if(!/^[a-zA-Z0-9_-]{1,128}$/.test(selector))throw new ApiError("VALIDATION_ERROR",400,"Identificador inválido");query=query.where("slug","==",selector);}
 if(!actor && resource!=="REVIEWS")query=query.where("active","==",true);
 if(actor){
  if(resource==="NOTIFICATIONS")query=query.where("recipientUid","==",actor.uid);
  if(resource==="CONVERSATIONS")query=query.where("participantUids","array-contains",actor.uid);
  if(actor.role==="customer" && ["APPOINTMENTS","PAYMENTS","REVIEWS"].includes(resource))query=query.where("customerUid","==",actor.uid);
  if(actor.role==="stylist"){
   if(["APPOINTMENTS","REVIEWS","COMMISSIONS"].includes(resource))query=query.where("stylistUid","==",actor.uid);
   if(resource==="CUSTOMERS")query=query.where("assignedStylistUids","array-contains",actor.uid);
   if(resource==="STYLISTS")query=query.where("uid","==",actor.uid);
   if(resource==="SERVICES"){
    const staff=await db.collection("salons/"+id+"/stylists").where("uid","==",actor.uid).limit(2).get();
    if(staff.size!==1 || staff.docs[0].data().salonId!==id || staff.docs[0].data().fixture===true)return {items:[],nextCursor:null,scanned:0};
    const ids=strings(staff.docs[0].data().serviceIds??staff.docs[0].data().servicesIds);
    if(!ids.length)return {items:[],nextCursor:null,scanned:0};
    if(ids.length>30)throw new ApiError("CONFLICT",409,"La asignación de servicios requiere revisión administrativa");
    query=query.where(FieldPath.documentId(),"in",ids);
   }
  }
 }
 if(resource==="APPOINTMENTS"){
  if(options.status)query=query.where("status","==",options.status);
  if(options.stylistId && actor && operational.includes(actor.role))query=query.where("stylistId","==",options.stylistId);
 }
 query=query.orderBy(FieldPath.documentId()).limit(options.limit+1);if(options.cursor)query=query.startAfter(options.cursor);
 const snapshot=await query.get();const docs=snapshot.docs.slice(0,options.limit);
 const items=[];
 for(const doc of docs){const data=doc.data();
  if(data.salonId!==id)throw new Error("Record tenant mismatch");
  if(!actor && (data.fixture===true||data.visible===false))continue;
  if(actor&&!operational.includes(actor.role)&&data.fixture===true)continue;
  if(resource==="REVIEWS"){
   const appointmentId=text(data.appointmentId);let appointment:Stored|undefined;
   if(/^[A-Za-z0-9_-]{1,128}$/.test(appointmentId))appointment=(await db.doc("salons/"+id+"/appointments/"+appointmentId).get()).data();
   const verified=genuineReview(data,appointment,id);if(!actor&&!verified)continue;data.appointmentVerified=verified;
  }
  const mapped=mapRecord(resource,doc.id,data);if(!actor){delete mapped.uid;delete mapped.customerUid;delete mapped.stylistUid;}items.push(mapped);
 }
 return {items:items as DataPage<R>["items"],nextCursor:snapshot.size>options.limit?docs.at(-1)?.id??null:null,scanned:docs.length};
}
export function resourceGET(resource:Resource,publicAllowed=false){return handler(async req=>{
 const params=new URL(req.url).searchParams;
 const isPublic=publicAllowed && params.get("view")!=="private";
 const actor=isPublic?undefined:await authorize(await authenticate(req));
 return ok(await listRecords(resource,readOptions.parse(Object.fromEntries(["limit","cursor","status","stylistId"].flatMap(key=>params.has(key)?[[key,params.get(key)]]:[]))),actor,params.get("slug")??undefined));
});}
