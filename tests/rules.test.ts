import { readFileSync } from "node:fs";
import { beforeAll, afterAll, it } from "vitest";
import { initializeTestEnvironment, assertFails, assertSucceeds, type RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, collection, query, where, limit, getDocs } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
let env: RulesTestEnvironment;
beforeAll(async()=>{
 if (process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8080") throw new Error("Rules tests require local Firestore emulator");
 env=await initializeTestEnvironment({projectId:"demo-lashess-priir-test",firestore:{host:"127.0.0.1",port:8080,rules:readFileSync("firestore.rules","utf8")},storage:{host:"127.0.0.1",port:9199,rules:readFileSync("storage.rules","utf8")}});
 await env.clearFirestore();
 await env.withSecurityRulesDisabled(async ctx=>{const db=ctx.firestore();for(const salon of ["a","b"]){await setDoc(doc(db,"salons/"+salon),{active:true});await setDoc(doc(db,"salons/"+salon+"/appointments/appointment"),{salonId:salon,customerUid:salon==="a"?"customer":"other",stylistUid:"stylist"});}for(const [uid,role] of [["customer","customer"],["other","customer"],["stylist","stylist"],["admin","admin"]])await setDoc(doc(db,"salons/a/members/"+uid),{uid,salonId:"a",active:true,role});await setDoc(doc(db,"users/customer"),{uid:"customer"});await setDoc(doc(db,"salons/a/products/item"),{salonId:"a"});});
});
afterAll(async()=>{await env?.cleanup();});
it("denies anonymous profile and appointment access",async()=>{const db=env.unauthenticatedContext().firestore();await assertFails(getDoc(doc(db,"users/customer")));await assertFails(getDoc(doc(db,"salons/a/appointments/appointment")));});
it("isolates customers and salons",async()=>{const db=env.authenticatedContext("customer").firestore();await assertSucceeds(getDoc(doc(db,"users/customer")));await assertSucceeds(getDoc(doc(db,"salons/a/appointments/appointment")));await assertFails(getDoc(doc(db,"salons/b/appointments/appointment")));await assertFails(getDoc(doc(env.authenticatedContext("other").firestore(),"salons/a/appointments/appointment")));});
it("requires scoped bounded appointment queries",async()=>{const db=env.authenticatedContext("customer").firestore();await assertSucceeds(getDocs(query(collection(db,"salons/a/appointments"),where("customerUid","==","customer"),limit(50))));await assertFails(getDocs(collection(db,"salons/a/appointments")));});
it("allows only assigned stylist appointments",async()=>{await assertSucceeds(getDoc(doc(env.authenticatedContext("stylist").firestore(),"salons/a/appointments/appointment")));});
it("denies client privilege changes and all financial/inventory writes even for admin",async()=>{for(const uid of ["customer","admin"]){const db=env.authenticatedContext(uid).firestore();for(const target of ["members/"+uid,"products/item","payments/item","expenses/item","appointments/appointment"])await assertFails(setDoc(doc(db,"salons/a/"+target),{role:"owner"}));}});
it("denies unrestricted storage uploads",async()=>{await assertFails(uploadBytes(ref(env.authenticatedContext("customer").storage(),"salons/a/expenseReceipts/item/customer/receipt.pdf"),new Uint8Array([1]),{contentType:"application/pdf"}));});
