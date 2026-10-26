import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
// Offline administrative CLI only. Requires a privileged service identity and explicit project confirmation.
const [uid, confirmedProject] = process.argv.slice(2);
const projectId = process.env.FIREBASE_PROJECT_ID, salonId = process.env.SALON_ID;
if (!uid || !confirmedProject || confirmedProject !== projectId || !salonId || !/^[a-zA-Z0-9_-]+$/.test(salonId)) throw new Error("Usage: bootstrap-owner <existing-firebase-uid> <exact-project-id>; set SALON_ID");
if (process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST) throw new Error("Use the local seed for emulator roles");
if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) throw new Error("Explicit administrative service credentials required");
const app = initializeApp({projectId,credential:cert({projectId,clientEmail:process.env.FIREBASE_CLIENT_EMAIL,privateKey:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,"\n")})});
const user = await getAuth(app).getUser(uid);
if (!user.emailVerified || user.disabled) throw new Error("Owner identity must be enabled and email verified");
const db = getFirestore(app);
await db.runTransaction(async tx => {
 const salon = db.doc("salons/" + salonId), snapshot = await tx.get(salon);
 if (snapshot.data()?.ownerUid) throw new Error("Owner already bootstrapped; use audited administrative process to change ownership");
 const now = FieldValue.serverTimestamp();
 tx.set(salon,{id:salonId,name:"lashess-priir",active:true,currency:"UYU",timezone:"America/Montevideo",ownerUid:uid,updatedAt:now},{merge:true});
 tx.set(db.doc("users/" + uid),{uid,displayName:user.displayName ?? "",phone:"",updatedAt:now},{merge:true});
 tx.set(db.doc("salons/" + salonId + "/members/" + uid),{uid,salonId,role:"owner",active:true,createdAt:now,updatedAt:now});
 tx.create(db.collection("salons/" + salonId + "/auditLogs").doc(),{salonId,actorUid:uid,action:"owner.bootstrap",resourcePath:salon.path,createdAt:now});
});
console.log("Owner bootstrap completed for the explicitly confirmed project.");
