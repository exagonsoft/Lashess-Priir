import type { Timestamp } from "firebase/firestore";
export const roles = ["owner", "admin", "receptionist", "stylist", "customer"] as const;
export type Role = typeof roles[number];
export interface Money { amountMinor: number; currency: "UYU"; }
export interface StoredEntity { id: string; salonId: string; createdAt: Timestamp; updatedAt: Timestamp; }
export interface UserProfile { uid: string; displayName: string; phone: string; createdAt: Timestamp; updatedAt: Timestamp; }
export interface Membership { uid: string; salonId: string; role: Role; active: boolean; createdAt: Timestamp; updatedAt: Timestamp; }
export interface Salon { id: string; name: string; currency: "UYU"; timezone: string; active: boolean; }
export interface Customer extends StoredEntity { uid: string; displayName: string; assignedStylistUids: string[]; }
export interface Stylist extends StoredEntity { uid: string; displayName: string; serviceIds: string[]; active: boolean; }
export interface Service extends StoredEntity { name: string; durationMinutes: number; price: Money; deposit: Money; active: boolean; }
export interface Appointment extends StoredEntity { customerUid: string; stylistUid: string; serviceIds: string[]; startsAt: Timestamp; endsAt: Timestamp; status: "pending" | "confirmed" | "completed" | "cancelled"; total: Money; }
export interface BookingHold extends StoredEntity { customerUid: string; stylistUid: string; startsAt: Timestamp; endsAt: Timestamp; expiresAt: Timestamp; }
export interface Payment extends StoredEntity { customerUid: string; appointmentId: string; amount: Money; status: "pending" | "settled" | "refunded"; providerReference: string; }
export interface Product extends StoredEntity { name: string; unit: string; quantityMilliunits: number; averageUnitCost: Money; }
export interface InventoryMovement extends StoredEntity { productId: string; quantityMilliunits: number; reason: string; actorUid: string; }
export interface Supplier extends StoredEntity { name: string; contact: string; }
export interface Purchase extends StoredEntity { supplierId: string; total: Money; receiptPath?: string; }
export interface Expense extends StoredEntity { category: string; amount: Money; receiptPath?: string; }
export interface Commission extends StoredEntity { stylistUid: string; appointmentId: string; amount: Money; status: "accrued" | "paid"; }
export interface Review extends StoredEntity { customerUid: string; appointmentId: string; rating: number; comment: string; published: boolean; }
export interface ChatThread extends StoredEntity { participantUids: string[]; lastMessageAt: Timestamp; }
export interface ChatMessage extends StoredEntity { senderUid: string; text: string; }
export interface Notification extends StoredEntity { recipientUid: string; title: string; description: string; read: boolean; }
export interface AuditLog extends StoredEntity { actorUid: string; action: string; resourcePath: string; requestId: string; }
export interface Me { uid: string; email: string | null; emailVerified: boolean; salonId: string; role: Role; profile: { displayName: string; phone: string }; }
export const businessCollections = ["customers", "stylists", "services", "appointments", "bookingHolds", "payments", "products", "inventoryMovements", "suppliers", "purchases", "expenses", "commissions", "reviews", "chatThreads", "notifications", "auditLogs"] as const;
export type BusinessCollection = typeof businessCollections[number];
