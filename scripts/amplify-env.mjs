import { writeFileSync } from "node:fs";
const required = ["APP_ORIGIN","SALON_ID","FIREBASE_PROJECT_ID","FIREBASE_CLIENT_EMAIL","FIREBASE_PRIVATE_KEY","NEXT_PUBLIC_FIREBASE_API_KEY","NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN","NEXT_PUBLIC_FIREBASE_PROJECT_ID","NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET","NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID","NEXT_PUBLIC_FIREBASE_APP_ID"];
for(const key of required) if(!process.env[key] || process.env[key].startsWith("REPLACE_")) throw new Error("Missing deployment variable: " + key);
if(new URL(process.env.APP_ORIGIN).protocol !== "https:") throw new Error("Production APP_ORIGIN must use HTTPS");
if(process.env.FIREBASE_PROJECT_ID !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID.startsWith("demo-")) throw new Error("Production Firebase project mismatch or demo project");
for(const key of ["FIREBASE_AUTH_EMULATOR_HOST","FIRESTORE_EMULATOR_HOST","FIREBASE_STORAGE_EMULATOR_HOST"]) if(process.env[key]) throw new Error("Emulator variable present: " + key);
// Allowlist only. Do not print credentials or copy unrelated AWS environment secrets.
writeFileSync(".env.production",required.map(key=>key+"="+JSON.stringify(process.env[key])).join("\n")+"\nNEXT_PUBLIC_USE_FIREBASE_EMULATORS=false\nNEXT_PUBLIC_ENABLE_FIXTURES=false\n",{mode:0o600});
