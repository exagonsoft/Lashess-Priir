import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
export function adminServices() {
 const projectId = process.env.FIREBASE_PROJECT_ID;
 const emulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_STORAGE_EMULATOR_HOST);
 if (emulator) throw new Error("Application emulator connections are disabled; configure the real Firebase project");
 if (!projectId) throw new Error("Missing FIREBASE_PROJECT_ID");
 if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) throw new Error("Missing Firebase Admin credentials");
 const app = getApps().find(a => a.name === "lashess-priir-admin") ?? initializeApp({ projectId, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, credential: cert({ projectId, clientEmail: process.env.FIREBASE_CLIENT_EMAIL!, privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n") }) }, "lashess-priir-admin");
 return { auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) };
}
