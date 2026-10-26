// Read-only audit. Never creates, updates, seeds, or deletes salon records.
import { readFileSync, writeFileSync } from "node:fs";
import { parse } from "dotenv";
import { cert, initializeApp, deleteApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const env=parse(readFileSync(".env.local"));
if(env.FIREBASE_PROJECT_ID!=="lashess-priir"||env.SALON_ID!=="lashess-priir")throw new Error("Unexpected project/salon");
const app=initializeApp({projectId:env.FIREBASE_PROJECT_ID,credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,"\n")})},"read-only-audit");
const db=getFirestore(app);db.settings({preferRest:true});
const report={date:new Date().toISOString(),project:"lashess-priir",database:"(default)",salon:"lashess-priir",readOnly:true,collections:[]};
try {
 const salon=await db.doc("salons/lashess-priir").get();report.salonExists=salon.exists;
 for(const name of ["services","stylists","customers","appointments","products","suppliers","purchases","expenses","reviews","chatThreads","notifications","employees","payments","commissions","inventoryMovements"]){
 const snapshot=await db.collection("salons/lashess-priir/"+name).limit(5).get();
 report.collections.push({name,sampled:snapshot.size,fixtures:snapshot.docs.filter(d=>d.data().fixture===true).length,withUid:snapshot.docs.filter(d=>typeof d.data().uid==="string").length,fields:[...new Set(snapshot.docs.flatMap(d=>Object.keys(d.data())))]});
 }
 report.status="passed";
}catch(error){report.status="failed";report.code=String(error.code??"unknown");process.exitCode=1;}
finally{await db.terminate();await deleteApp(app);writeFileSync("docs/firestore-audit.json",JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
