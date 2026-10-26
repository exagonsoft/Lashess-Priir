import { expect, it, vi, afterEach } from "vitest";
afterEach(()=>{vi.unstubAllEnvs();vi.resetModules();});
it("admin import does not initialize credentials at build time",async()=>{vi.stubEnv("FIREBASE_PROJECT_ID","");const adminModule=await import("@/server/firebase/admin");expect(()=>adminModule.adminServices()).toThrow("Missing FIREBASE_PROJECT_ID");});
it("forbids emulator configuration in production",async()=>{vi.stubEnv("NODE_ENV","production");vi.stubEnv("FIREBASE_AUTH_EMULATOR_HOST","127.0.0.1:9099");const adminModule=await import("@/server/firebase/admin");expect(()=>adminModule.adminServices()).toThrow("Application emulator connections are disabled");});
