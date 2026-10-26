import { describe, it, expect } from "vitest";
import { canAccess, canManageFinance } from "@/lib/permissions";
import { authError } from "@/lib/firebase/errors";
import { assertLocalEmulators } from "../scripts/emulator-guard";
import { profilePatch } from "@/server/profiles";
describe("role boundaries",()=>{
 it("separates signed-in customers from administrators",()=>{expect(canAccess("customer","customer")).toBe(true); expect(canAccess("customer","admin")).toBe(false); expect(canAccess("customer","stylist")).toBe(false);});
 it("limits staff and reception",()=>{expect(canAccess("stylist","stylist")).toBe(true);expect(canAccess("stylist","admin")).toBe(false);expect(canManageFinance("receptionist")).toBe(false);expect(canManageFinance("admin")).toBe(true);});
});
it("does not accept UID, role or tenancy in profile updates",()=>{for(const field of ["uid","role","salonId","active"]){expect(profilePatch.safeParse({displayName:"A",[field]:"owner"}).success).toBe(false);}expect(profilePatch.safeParse({displayName:"A",phone:"+598 123"}).success).toBe(true);});
it("rejects seeds outside isolated local emulators",()=>{expect(()=>assertLocalEmulators({FIREBASE_PROJECT_ID:"production"})).toThrow();expect(()=>assertLocalEmulators({FIREBASE_PROJECT_ID:"demo-lashess-priir-test",FIRESTORE_EMULATOR_HOST:"remote:8080"})).toThrow();});
it("reports provider cancellation and configuration errors without pretending success",()=>{expect(authError({code:"auth/popup-closed-by-user"})).toContain("Cancelaste");expect(authError({code:"auth/operation-not-allowed"})).toContain("Firebase Console");expect(authError({code:"auth/account-exists-with-different-credential"})).toContain("no se vinculan automáticamente");});
