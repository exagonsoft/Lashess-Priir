
import "server-only";

import { createPrivateKey } from "node:crypto";
import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const APP_NAME = "lashess-priir-admin";

function getPrivateKey(): string {
  const raw = process.env.FIREBASE_PRIVATE_KEY;

  if (!raw) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY");
  }

  // Supports environment variables containing literal \n
  // as well as actual newline characters.
  const privateKey = raw
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  if (
    !privateKey.startsWith("-----BEGIN PRIVATE KEY-----") ||
    !privateKey.endsWith("-----END PRIVATE KEY-----")
  ) {
    throw new Error(
      "Invalid Firebase private key PEM format",
    );
  }

  // Validate the key before passing it to Firebase Admin.
  // Do not log the key itself.
  try {
    createPrivateKey(privateKey);
  } catch {
    throw new Error(
      "Invalid Firebase private key: unable to parse PEM",
    );
  }

  return privateKey;
}

export function adminServices() {
  const projectId = process.env.FIREBASE_PROJECT_ID;

  const emulator = Boolean(
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    process.env.FIRESTORE_EMULATOR_HOST ||
    process.env.FIREBASE_STORAGE_EMULATOR_HOST,
  );

  if (emulator) {
    throw new Error(
      "Application emulator connections are disabled; configure the real Firebase project",
    );
  }

  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID");
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!clientEmail) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL");
  }

  const existingApp = getApps().find(
    (app) => app.name === APP_NAME,
  );

  const app =
    existingApp ??
    initializeApp(
      {
        projectId,
        storageBucket:
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        credential: cert({
          projectId,
          clientEmail,
          privateKey: getPrivateKey(),
        }),
      },
      APP_NAME,
    );

  return {
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
}
