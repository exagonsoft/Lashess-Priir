// Isolated repository checks. No Firebase connection, credentials, or child processes.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = fileURLToPath(new URL("../", import.meta.url));
function load(file, dependencies = {}, globals = {}) {
 const exports = {};
 const source = ts.transpileModule(readFileSync(root + file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
 const localRequire = name => { if (name in dependencies) return dependencies[name]; throw new Error("Unexpected dependency: " + name); };
 vm.runInNewContext(source, { exports, require: localRequire, Date, Error, ...globals }, {filename:file});
 return exports;
}
let checks = 0;
const guard = load("scripts/emulator-guard.ts").assertLocalEmulators;
const local = { NODE_ENV:"test", FIREBASE_PROJECT_ID:"demo-lashess-priir-test", FIRESTORE_EMULATOR_HOST:"127.0.0.1:8080", FIREBASE_AUTH_EMULATOR_HOST:"127.0.0.1:9099", FIREBASE_STORAGE_EMULATOR_HOST:"127.0.0.1:9199" };
guard(local); checks++;
for (const override of [{NODE_ENV:"production"},{FIREBASE_PROJECT_ID:"live-project"},{FIRESTORE_EMULATOR_HOST:"remote:8080"},{FIREBASE_AUTH_EMULATOR_HOST:""},{FIREBASE_STORAGE_EMULATOR_HOST:""}]) { assert.throws(() => guard({...local,...override})); checks++; }
const calls = [];
let records = [];
const query = { where: (...args) => {calls.push(["where",...args]);return query;}, orderBy: () => query, limit: n => {calls.push(["limit",n]);return query;}, startAfter: id => {calls.push(["cursor",id]);return query;}, get: async () => ({size:records.length,docs:records.map((data,i)=>({id:"record-"+i,data:()=>data}))}) };
const repo = load("src/server/repositories.ts", { "server-only":{}, "zod":require("zod"), "firebase-admin/firestore":{FieldValue:{},FieldPath:{documentId:()=>"__name__"}}, "./firebase/admin":{adminServices:()=>({db:{collection:path=>{calls.push(["collection",path]);return query;}}})} });
const actor = {uid:"customer-1",salonId:"salon-a",role:"customer"};
const record = {salonId:"salon-a",customerUid:"customer-1",status:"confirmed",serviceIds:["service-1"],total:{amountMinor:10000,currency:"UYU"},startsAt:{toDate:()=>new Date("2026-10-26T12:00:00Z")},endsAt:{toDate:()=>new Date("2026-10-26T13:00:00Z")},internalNotes:"PRIVATE"};
records=[record,record];
const page=await repo.customerAppointments(actor,{limit:1,cursor:"previous"});
assert.equal(page.items.length,1); checks++;
assert.equal(page.nextCursor,"record-0"); checks++;
assert.equal(page.items[0].startsAt,"2026-10-26T12:00:00.000Z"); checks++;
assert.equal("internalNotes" in page.items[0],false); checks++;
assert.ok(calls.some(c=>c[0]==="collection"&&c[1]==="salons/salon-a/appointments")); checks++;
assert.ok(calls.some(c=>c[0]==="where"&&c[1]==="customerUid"&&c[3]==="customer-1")); checks++;
assert.ok(calls.some(c=>c[0]==="limit"&&c[1]===2)); checks++;
assert.ok(calls.some(c=>c[0]==="cursor"&&c[1]==="previous")); checks++;
for(const override of [{salonId:"salon-b"},{customerUid:"other"},{fixture:true},{startsAt:null},{status:"invented"},{total:{amountMinor:-1,currency:"UYU"}}]) {records=[{...record,...override}];await assert.rejects(()=>repo.customerAppointments(actor,{limit:25}));checks++;}
records=[]; const empty=await repo.customerAppointments(actor,{limit:25});assert.equal(empty.items.length,0);assert.equal(empty.nextCursor,null);checks+=2;
for(const paging of [{limit:101},{limit:0},{limit:25,cursor:"../other"}]){await assert.rejects(()=>repo.customerAppointments(actor,paging));checks++;}

let certificate;
const admin = load("src/server/firebase/admin.ts", {
 "server-only": {},
 "firebase-admin/app": { cert: value => { certificate = value; return value; }, getApps: () => [], initializeApp: () => ({}) },
 "firebase-admin/auth": { getAuth: () => ({}) },
 "firebase-admin/firestore": { getFirestore: () => ({}) },
 "firebase-admin/storage": { getStorage: () => ({}) },
}, {process:{env:{FIREBASE_PROJECT_ID:"isolated",FIREBASE_CLIENT_EMAIL:"test@example.test",FIREBASE_PRIVATE_KEY:"FIRST"+String.fromCharCode(92)+"nSECOND"}}});
admin.adminServices();assert.equal(certificate.privateKey,"FIRST"+String.fromCharCode(10)+"SECOND");checks++;
const deployKeys=["APP_ORIGIN","SALON_ID","FIREBASE_PROJECT_ID","FIREBASE_CLIENT_EMAIL","FIREBASE_PRIVATE_KEY","NEXT_PUBLIC_FIREBASE_API_KEY","NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN","NEXT_PUBLIC_FIREBASE_PROJECT_ID","NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET","NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID","NEXT_PUBLIC_FIREBASE_APP_ID"];
const deployEnv=Object.fromEntries(deployKeys.map(key=>[key,"unit-value"]));deployEnv.APP_ORIGIN="https://example.test";
let written;
vm.runInNewContext(readFileSync(root+"scripts/amplify-env.mjs","utf8").replace('import { writeFileSync } from "node:fs";',""),{process:{env:deployEnv},URL,writeFileSync:(_path,content)=>{written=content;}});
const parsedEnv=require("dotenv").parse(written);for(const key of deployKeys)assert.equal(parsedEnv[key],deployEnv[key]);checks++;

console.log(JSON.stringify({suite:"isolated foundation",checks,status:"passed",firebaseConnections:0}));
