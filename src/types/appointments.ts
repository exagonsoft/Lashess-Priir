export interface CustomerAppointmentRecord {
 id: string;
 startsAt: string;
 endsAt: string;
 status: "pending" | "confirmed" | "completed" | "cancelled";
 serviceIds: string[];
 total: { amountMinor: number; currency: "UYU" };
}
export interface CustomerAppointmentPage { items: CustomerAppointmentRecord[]; nextCursor: string | null; }
