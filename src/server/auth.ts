import "server-only";
import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import type { Role } from "@/types/domain";
import { roles } from "@/types/domain";
import { adminServices } from "./firebase/admin";
import { ApiError } from "./api/errors";
export const sessionName = process.env.NODE_ENV === "production" ? "__Host-lashess-priir-session" : "lashess-priir-session";
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
export function assertSameOrigin(req: Request) {
 const origin = req.headers.get("origin");
 const expected = process.env.APP_ORIGIN;
 if (!expected) throw new Error("APP_ORIGIN is required for session operations");
 if (origin !== new URL(expected).origin || req.headers.get("sec-fetch-site") === "cross-site") throw new ApiError("FORBIDDEN", 403, "Origen no autorizado");
}
export async function authenticate(req?: Request): Promise<DecodedIdToken> {
 const header = req?.headers.get("authorization");
 if (header) { if (!/^Bearer [^ ]+$/.test(header)) throw new ApiError("UNAUTHENTICATED", 401, "Token inválido"); const auth = adminServices().auth; try { return await auth.verifyIdToken(header.slice(7), true); } catch { throw new ApiError("UNAUTHENTICATED", 401, "Sesión inválida"); } }
 if (req && !["GET", "HEAD", "OPTIONS"].includes(req.method)) assertSameOrigin(req);
 const session = (await cookies()).get(sessionName)?.value;
 if (!session) throw new ApiError("UNAUTHENTICATED", 401, "Iniciá sesión");
 const auth = adminServices().auth;
 try { return await auth.verifySessionCookie(session, true); } catch { throw new ApiError("UNAUTHENTICATED", 401, "Sesión inválida"); }
}
export function salonId() { const id = process.env.SALON_ID; if (!id || !/^[a-zA-Z0-9_-]{1,80}$/.test(id)) throw new Error("Valid SALON_ID required"); return id; }
export async function authorize(identity: DecodedIdToken, allowed?: readonly Role[]) {
 const id = salonId();
 const db = adminServices().db;
 const [membership, salon] = await Promise.all([db.doc("salons/" + id + "/members/" + identity.uid).get(), db.doc("salons/" + id).get()]);
 const member = membership.data();
 if (!salon.exists || !salon.data()?.active || !member?.active || member.uid !== identity.uid || member.salonId !== id || !roles.includes(member.role)) throw new ApiError("FORBIDDEN", 403, "Sin acceso a este salón");
 const role = member.role as Role;
 if (allowed && !allowed.includes(role)) throw new ApiError("FORBIDDEN", 403, "No tenés permiso para esta operación");
 return { uid: identity.uid, salonId: id, role, identity };
}
export type Actor = Awaited<ReturnType<typeof authorize>>;
