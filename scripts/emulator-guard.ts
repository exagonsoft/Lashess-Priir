export function assertLocalEmulators(env: Readonly<Record<string, string | undefined>>) {
 if (env.NODE_ENV === "production" || env.FIREBASE_PROJECT_ID !== "demo-lashess-priir-test") throw new Error("Isolated rules tests require demo-lashess-priir-test outside production");
 for (const key of ["FIRESTORE_EMULATOR_HOST", "FIREBASE_AUTH_EMULATOR_HOST", "FIREBASE_STORAGE_EMULATOR_HOST"]) if (!/^127\.0\.0\.1:\d+$/.test(env[key] ?? "")) throw new Error(key + " must point to loopback");
}
