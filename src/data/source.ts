// Presentation boundary. These are Arena view models, not persisted domain models.
export type {
  ServiceCategory,
  MaterialLine,
  Service,
  Stylist,
  Customer,
  AppointmentStatus,
  PaymentStatus,
  Appointment,
  Product,
  Supplier,
  PurchaseExpense,
  PurchaseItem,
  Purchase,
  Expense,
  Review,
  ChatMessage,
  Conversation,
  NotificationItem,
  Employee,
} from "@/types/presentation";
export const CURRENCY = "UYU";
export function formatUYU(amount: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(amount);
}
export const MATERIAL_RECIPES_NOTE =
  "Cada servicio tiene una receta estándar de consumo de materiales que se confirma al finalizar la cita.";
