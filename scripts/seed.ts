/** Creates only the real salon document; never imports fixtures or overwrites existing data. */
import { config } from 'dotenv';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

config({ path: '.env.local' });

if (process.argv[2] !== 'bootstrap') {
  throw new Error('Only bootstrap is supported. Synthetic records must never be imported into Cloud Firestore.');
}

const salonId = process.env.SALON_ID || 'lashess-priir';
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

if (!projectId) throw new Error('Missing FIREBASE_PROJECT_ID');
if (!/^[\w-]+$/.test(salonId)) throw new Error('Invalid SALON_ID');

// This application uses real Cloud Firestore rather than emulators.
if (emulatorHost) {
  throw new Error('Remove FIRESTORE_EMULATOR_HOST: this script targets Cloud Firestore');
}
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId,
        clientEmail: required('FIREBASE_CLIENT_EMAIL'),
        privateKey: required('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      }),
    });

const db = getFirestore(app);
const salonRef = db.collection('salons').doc(salonId);

async function bootstrap(): Promise<void> {
  try {
    await salonRef.create({
      name: 'lashess-priir',
      slug: salonId,
      currency: 'UYU',
      locale: 'es-UY',
      timezone: 'America/Montevideo',
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`CREATED salons/${salonId}`);
  } catch (error) {
    const code = (error as { code?: number | string }).code;
    if (code === 6 || code === '6' || code === 'already-exists') {
      console.log(`EXISTS salons/${salonId} (not overwritten)`);
      return;
    }
    throw error;
  }
}

bootstrap().catch((error: unknown) => {
  console.error("BOOTSTRAP FAILED:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
