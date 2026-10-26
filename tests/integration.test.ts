import { describe, it, expect } from "vitest";
import { mapRecord, minor, genuineReview, sumMinor, salonDate, salonTime } from "@/lib/record-mapping";
import { allowedResource } from "@/lib/data-access";
describe("Firestore data mapping",()=>{
 it.each([["12.34",1234],[0,0],["0.01",1],[{amountMinor:120,currency:"UYU"},120],["1.234",null],[{amountMinor:5,currency:"USD"},null],[NaN,null]])("maps monetary value %j to integer minor units",(input,result)=>expect(minor(input)).toBe(result));
 it("maps service presentation without trusting imported ratings",()=>{const s=mapRecord("SERVICES","s",{name:"Servicio",price:1200,deposit:200,duration:60,active:true,rating:5,reviewCount:800,benefits:["A"]});expect(s.price).toBe(1200);expect(s.duration).toBe(60);expect(s.rating).toBe(0);expect(s.reviewCount).toBe(0);expect(s.benefits).toEqual(["A"]);});
 it("maps UID-based service money",()=>expect(mapRecord("SERVICES","s",{price:{amountMinor:150050,currency:"UYU"},durationMinutes:45}).price).toBe(1500.5));
 it("maps stylist service associations without fabricated ratings",()=>{const s=mapRecord("STYLISTS","st",{uid:"uid",displayName:"Name",serviceIds:["s"],rating:4.9});expect(s.uid).toBe("uid");expect(s.servicesIds).toEqual(["s"]);expect(s.rating).toBe(0);});
 it("marks fixtures visibly",()=>expect(mapRecord("PRODUCTS","p",{name:"Producto",fixture:true}).name).toBe("[Muestra] Producto"));
 it("does not import customer financial aggregates",()=>{const c=mapRecord("CUSTOMERS","c",{totalSpent:99999,totalVisits:80});expect(c.totalSpent).toBe(0);expect(c.totalVisits).toBe(0);});
 it("does not treat appointment paid as a ledger payment",()=>{const a=mapRecord("APPOINTMENTS","a",{paid:5000,price:5000,status:"confirmed"});expect(a.paid).toBe(0);expect(a.paymentStatus).toBe("Sin conciliación");expect(a.status).toBe("Confirmada");});
 it("maps inventory base units",()=>expect(mapRecord("PRODUCTS","p",{quantityMilliunits:1250}).stock).toBe(1.25));
 it("uses the salon timezone across UTC midnight",()=>{expect(salonDate("2026-10-26T01:00:00Z")).toBe("2026-10-25");expect(salonTime("2026-10-26T01:00:00Z")).toBe("22:00");});
});
describe("review integrity",()=>{const review={salonId:"a",customerUid:"c",published:true,fixture:false};const appointment={salonId:"a",customerUid:"c",status:"completed",fixture:false};
 it("accepts an approved review owned by a completed appointment customer",()=>expect(genuineReview(review,appointment,"a")).toBe(true));
 it.each([{fixture:true},{customerUid:"other"},{salonId:"b"},{status:"confirmed"}])("rejects invalid appointment %j",patch=>expect(genuineReview(review,{...appointment,...patch},"a")).toBe(false));
 it("never accepts a fixture review even with verified:true",()=>expect(genuineReview({...review,fixture:true,verified:true},appointment,"a")).toBe(false));
 it("requires publication approval and the appointment",()=>{expect(genuineReview({...review,published:false},appointment,"a")).toBe(false);expect(genuineReview(review,undefined,"a")).toBe(false);});
});
describe("financial separation",()=>{
 it("excludes sample and unsettled money",()=>expect(sumMinor([{fixture:false,amountMinor:10001,status:"settled"},{fixture:true,amountMinor:50000,status:"settled"},{fixture:false,amountMinor:20000,status:"pending"}],"settled")).toBe(10001));
 it("reports unknown amounts instead of fabricating totals",()=>expect(sumMinor([{fixture:false,amountMinor:null,status:"settled"}],"settled")).toBeNull());
 it("rejects unsafe integer aggregates",()=>expect(sumMinor([{fixture:false,amountMinor:Number.MAX_SAFE_INTEGER,status:"paid"},{fixture:false,amountMinor:1,status:"paid"}],"paid")).toBeNull());
});
describe("role-specific resources",()=>{
 it.each(["owner","admin"])("allows finance to %s",role=>expect(allowedResource("EXPENSES",role)).toBe(true));
 it.each(["customer","stylist","receptionist"])("denies salon finance to %s",role=>expect(allowedResource("EXPENSES",role)).toBe(false));
 it("permits reception operations but not personnel",()=>{expect(allowedResource("CUSTOMERS","receptionist")).toBe(true);expect(allowedResource("EMPLOYEES","receptionist")).toBe(false);});
 it("restricts customer records and permits own payment scope",()=>{expect(allowedResource("CUSTOMERS","customer")).toBe(false);expect(allowedResource("PAYMENTS","customer")).toBe(true);});
});
