import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import type { DecodedIdToken } from "firebase-admin/auth";
import { z } from "zod";
import { adminServices } from "./firebase/admin";
import { salonId, type Actor } from "./auth";
import { ApiError } from "./api/errors";
export const profilePatch = z.object({ displayName: z.string().trim().min(1).max(100).optional(), phone: z.string().trim().max(30).regex(/^[+0-9 ()-]*$/).optional() }).strict().refine(v => Object.keys(v).length > 0);
// Only verified identity determines UID. This is never a client-supplied role grant.
export async function ensureProfile(identity: DecodedIdToken) {
 const db = adminServices().db, id = salonId();
 const user = db.doc("users/" + identity.uid), member = db.doc("salons/" + id + "/members/" + identity.uid), customer = db.doc("salons/" + id + "/customers/" + identity.uid);
 await db.runTransaction(async tx => {
  const [u, m, s] = await Promise.all([tx.get(user), tx.get(member), tx.get(db.doc("salons/" + id))]);
  if (!s.exists || !s.data()?.active) throw new ApiError("NOT_FOUND", 404, "Salón no disponible");
  const now = FieldValue.serverTimestamp();
  const displayName = typeof identity.name === "string" ? identity.name.slice(0, 100) : "";
  if (!u.exists) tx.create(user, { uid: identity.uid, displayName, phone: "", createdAt: now, updatedAt: now });
  if (!m.exists) { tx.create(member, { uid: identity.uid, salonId: id, role: "customer", active: true, createdAt: now, updatedAt: now }); tx.set(customer, { id: identity.uid, uid: identity.uid, salonId: id, displayName, assignedStylistUids: [], createdAt: now, updatedAt: now }); }
 });
}
export async function getMe(actor: Actor) {
 const profile = (await adminServices().db.doc("users/" + actor.uid).get()).data();
 if (!profile) throw new ApiError("NOT_FOUND", 404, "Perfil no disponible");
 return { uid: actor.uid, email: actor.identity.email ?? null, emailVerified: actor.identity.email_verified === true, salonId: actor.salonId, role: actor.role, profile: { displayName: profile.displayName as string, phone: profile.phone as string } };
}
export async function updateProfile(actor: Actor, input: z.infer<typeof profilePatch>) {
 const db = adminServices().db, batch = db.batch();
 batch.update(db.doc("users/" + actor.uid), { ...input, updatedAt: FieldValue.serverTimestamp() });
 batch.create(db.collection("salons/" + actor.salonId + "/auditLogs").doc(), { actorUid: actor.uid, salonId: actor.salonId, action: "profile.updated", resourcePath: "users/" + actor.uid, changedFields: Object.keys(input), createdAt: FieldValue.serverTimestamp() });
 await batch.commit(); return getMe(actor);
}
