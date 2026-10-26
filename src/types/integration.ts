import type * as V from "./presentation";
export interface RecordMeta { fixture: boolean; uid?: string; customerUid?: string; stylistUid?: string; }
export type Row<T> = T & RecordMeta;
export interface LedgerRecord extends RecordMeta { id: string; description: string; date: string; amountMinor: number | null; status: string; category: string; appointmentId: string; }
export interface DataMap {
 SERVICES: Row<V.Service>[]; STYLISTS: Row<V.Stylist>[]; CUSTOMERS: Row<V.Customer>[];
 APPOINTMENTS: Row<V.Appointment>[]; PRODUCTS: Row<V.Product>[]; SUPPLIERS: Row<V.Supplier>[];
 PURCHASES: Row<V.Purchase>[]; EXPENSES: Row<V.Expense>[]; REVIEWS: Row<V.Review>[];
 CONVERSATIONS: Row<V.Conversation>[]; NOTIFICATIONS: Row<V.NotificationItem>[]; EMPLOYEES: Row<V.Employee>[];
 PAYMENTS: LedgerRecord[]; COMMISSIONS: LedgerRecord[];
}
export type Resource = keyof DataMap;
export const collections: Record<Resource,string> = {SERVICES:"services",STYLISTS:"stylists",CUSTOMERS:"customers",APPOINTMENTS:"appointments",PRODUCTS:"products",SUPPLIERS:"suppliers",PURCHASES:"purchases",EXPENSES:"expenses",REVIEWS:"reviews",CONVERSATIONS:"chatThreads",NOTIFICATIONS:"notifications",EMPLOYEES:"employees",PAYMENTS:"payments",COMMISSIONS:"commissions"};
export interface DataPage<R extends Resource = Resource> { items: DataMap[R]; nextCursor: string | null; scanned: number; }
export interface MessageRecord { id:string; senderUid:string; senderRole:string; text:string; createdAt:string; }
