import type { Resource } from "@/types/integration";
const adminRoles=["owner","admin"];
export function allowedResource(resource:Resource,role:string):boolean {
 if(adminRoles.includes(role))return true;
 if(role==="receptionist")return ["SERVICES","STYLISTS","CUSTOMERS","APPOINTMENTS","REVIEWS","CONVERSATIONS","NOTIFICATIONS"].includes(resource);
 if(role==="stylist")return ["SERVICES","STYLISTS","CUSTOMERS","APPOINTMENTS","REVIEWS","CONVERSATIONS","NOTIFICATIONS","COMMISSIONS"].includes(resource);
 return role==="customer" && ["SERVICES","STYLISTS","APPOINTMENTS","PAYMENTS","REVIEWS","CONVERSATIONS","NOTIFICATIONS"].includes(resource);
}
