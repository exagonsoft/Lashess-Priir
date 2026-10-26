import "server-only";
import { createHash } from "node:crypto";
import { Timestamp, type Transaction } from "firebase-admin/firestore";
import { adminServices } from "./firebase/admin";
import { ApiError } from "./api/errors";
import type { Actor } from "./auth";
// Future operations must perform ONLY Firestore transaction work in this callback.
// Firestore retries callbacks; never call a payment provider or send email here.
export async function idempotent<T extends Record<string, unknown>>(actor: Actor, operation: string, key: string, canonicalBody: string, execute: (tx: Transaction) => Promise<T>) {
 if (!/^[a-zA-Z0-9_-]{16,128}$/.test(key)) throw new ApiError("VALIDATION_ERROR",400,"Idempotency-Key inválida");
 const hash = (value: string) => createHash("sha256").update(value).digest("hex");
 const db = adminServices().db;
 const reference = db.doc("salons/" + actor.salonId + "/idempotencyKeys/" + hash(actor.uid + ":" + operation + ":" + key));
 return db.runTransaction(async tx => { const previous = await tx.get(reference); const requestHash = hash(canonicalBody); if (previous.exists) { const record = previous.data()!; if (record.requestHash !== requestHash) throw new ApiError("CONFLICT",409,"La clave ya fue usada con otros datos"); return record.result as T; } const result = await execute(tx); tx.create(reference,{requestHash,result,actorUid:actor.uid,createdAt:Timestamp.now()});return result; });
}
