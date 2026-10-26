"use client";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
let services: ReturnType<typeof initialize> | undefined;
function initialize() {
 const config = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
 if (Object.values(config).some(v => !v || v.startsWith("REPLACE_"))) throw new Error("Falta configurar Firebase. Revisá las variables NEXT_PUBLIC_FIREBASE_*.");
 const existing = getApps().find(a => a.name === "lashess-priir-client");
 const app = existing ?? initializeApp(config, "lashess-priir-client");
 const auth = getAuth(app), db = getFirestore(app), storage = getStorage(app);
 return { app, auth, db, storage };
}
export function firebaseClient() { return services ??= initialize(); }
// FCM requires explicit user consent and a VAPID key; never prompt on initialization.
export async function messagingClient() { const { isSupported, getMessaging } = await import("firebase/messaging"); return await isSupported() ? getMessaging(firebaseClient().app) : null; }
