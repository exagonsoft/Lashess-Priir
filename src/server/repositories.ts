import "server-only";
import { FieldValue, FieldPath } from "firebase-admin/firestore";
import { z } from "zod";
import { adminServices } from "./firebase/admin";
import type { CustomerAppointmentPage } from "@/types/appointments";
import type { Actor } from "./auth";
export const pageSchema = z.object({ limit: z.coerce.number().int().min(1).max(100).default(25), cursor: z.string().regex(/^[a-zA-Z0-9_-]{1,128}$/).optional() });
// No arbitrary client-selected collection/path. Tenant and identity come from verified Actor.
export async function customerAppointments(actor: Actor, paging: z.infer<typeof pageSchema>): Promise<CustomerAppointmentPage> {
 const options = pageSchema.parse(paging);
 let q = adminServices().db.collection("salons/" + actor.salonId + "/appointments").where("customerUid","==",actor.uid).orderBy(FieldPath.documentId()).limit(options.limit + 1);
 if (options.cursor) q = q.startAfter(options.cursor);
 const results = await q.get(), docs = results.docs.slice(0,options.limit);
 const items = docs.map(doc => {
  const data = doc.data();
  // Admin SDK bypasses rules: validate tenancy and project only safe customer fields.
  if (data.salonId !== actor.salonId || data.customerUid !== actor.uid || data.fixture === true) throw new Error("Invalid appointment ownership or synthetic record");
  const record = z.object({
   status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
   serviceIds: z.array(z.string()),
   total: z.object({ amountMinor: z.number().int().nonnegative(), currency: z.literal("UYU") }),
  }).parse(data);
  if (typeof data.startsAt?.toDate !== "function" || typeof data.endsAt?.toDate !== "function") throw new Error("Invalid appointment dates");
  return { id: doc.id, ...record, startsAt: data.startsAt.toDate().toISOString(), endsAt: data.endsAt.toDate().toISOString() };
 });
 return {items,nextCursor:results.size > options.limit ? docs.at(-1)?.id ?? null : null};
}
export async function audit(actor: Actor, action: string, resourcePath: string, requestId: string) { await adminServices().db.collection("salons/" + actor.salonId + "/auditLogs").add({salonId:actor.salonId,actorUid:actor.uid,action,resourcePath,requestId,createdAt:FieldValue.serverTimestamp()}); }
