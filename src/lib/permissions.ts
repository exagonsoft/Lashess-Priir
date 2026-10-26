import type { Role } from "@/types/domain";
export const administrativeRoles: readonly Role[] = ["owner", "admin"];
export const operationalRoles: readonly Role[] = ["owner", "admin", "receptionist"];
export function canAccess(role: Role, area: "customer" | "stylist" | "admin") { return area === "customer" ? role === "customer" : area === "stylist" ? role === "stylist" : operationalRoles.includes(role); }
export function canManageFinance(role: Role) { return administrativeRoles.includes(role); }
