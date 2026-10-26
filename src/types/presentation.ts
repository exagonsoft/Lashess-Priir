// View models retained from the approved UI. Persisted Firestore models live in domain.ts.
export type ServiceCategory =
  | "Extensiones de pestañas"
  | "Lifting y tratamientos"
  | "Cejas"
  | "Servicios complementarios";

export interface MaterialLine {
  productId: string;
  expectedQty: number;
  unit: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  description: string;
  longDescription: string;
  benefits: string[];
  prep: string[];
  aftercare: string[];
  image: string;
  duration: number; // minutes
  price: number;
  deposit: number;
  rating: number;
  reviewCount: number;
  stylistIds: string[];
  active: boolean;
  materials: MaterialLine[];
}

export interface Stylist {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  bio: string;
  longBio: string;
  experienceYears: number;
  image: string;
  rating: number;
  reviewCount: number;
  portfolio: string[];
  servicesIds: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "Activo" | "VIP" | "Inactivo" | "Nuevo";
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  preferredService?: string;
  preferredStylist?: string;
  tags: string[];
}

export type AppointmentStatus =
  | "Pendiente"
  | "Confirmada"
  | "En curso"
  | "Completada"
  | "Cancelada"
  | "No show";

export type PaymentStatus = "Seña pagada" | "Pagado completo" | "Pendiente" | "Reembolsado";

export interface Appointment {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  date: string; // ISO date
  time: string; // HH:mm
  duration: number;
  price: number;
  paid: number;
  remaining: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  sku: string;
  category: string;
  brand: string;
  supplierId: string;
  purchasePrice: number;
  landedUnitCost: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  expiration?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: string;
  outstandingBalance: number;
  lastPurchase: string;
}

export interface PurchaseExpense {
  id: string;
  category: string;
  description: string;
  amount: number;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  date: string;
  invoice: string;
  currency: string;
  paymentStatus: "Pagado" | "Pendiente" | "Parcial";
  items: PurchaseItem[];
  expenses: PurchaseExpense[];
  allocationMethod: "value" | "quantity" | "manual";
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  vendor: string;
  method: "Efectivo" | "Tarjeta" | "Transferencia";
  status: "Pagado" | "Pendiente";
  recurring: boolean;
  linkedPurchaseId?: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar?: string;
  rating: number;
  serviceQuality: number;
  professionalism: number;
  experience: number;
  date: string;
  serviceName: string;
  stylistName: string;
  comment: string;
  verified: boolean;
  images?: string[];
  response?: string;
  status: "Publicada" | "Nueva" | "Reportada";
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "salon";
  text: string;
  time: string;
  read?: boolean;
}

export interface Conversation {
  id: string;
  customerName: string;
  avatar?: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: "Abierta" | "Resuelta";
  assignedTo: string;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  type:
    | "appointment"
    | "payment"
    | "review"
    | "inventory"
    | "message"
    | "commission";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: "Especialista" | "Recepción" | "Administración";
  image: string;
  specialties: string[];
  schedule: string;
  revenueGenerated: number;
  appointmentsCompleted: number;
  rating: number;
  commissionRate: number;
  commissionPaid: number;
  commissionPending: number;
}
