import type { ServiceCategory, MaterialLine, Service, Stylist, Customer, AppointmentStatus, PaymentStatus, Appointment, Product, Supplier, PurchaseExpense, PurchaseItem, Purchase, Expense, Review, ChatMessage, Conversation, NotificationItem, Employee } from "@/types/presentation";
export type { ServiceCategory, MaterialLine, Service, Stylist, Customer, AppointmentStatus, PaymentStatus, Appointment, Product, Supplier, PurchaseExpense, PurchaseItem, Purchase, Expense, Review, ChatMessage, Conversation, NotificationItem, Employee } from "@/types/presentation";
import { IMAGES } from "./images";

export const CURRENCY = "UYU";

export function formatUYU(amount: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const SERVICES: Service[] = [
  {
    id: "svc-1",
    slug: "extensiones-clasicas",
    name: "Extensiones de Pestañas Clásicas",
    category: "Extensiones de pestañas",
    description: "Una extensión por pestaña natural para un efecto elegante y definido.",
    longDescription:
      "Aplicación individual de extensiones de pestañas, una por una sobre cada pestaña natural, para lograr un efecto de densidad sutil y una mirada naturalmente definida. Ideal como primera experiencia con extensiones.",
    benefits: ["Efecto natural y elegante", "Larga duración (3-4 semanas)", "Resistente al agua"],
    prep: ["Llegar sin maquillaje en los ojos", "Evitar café o estimulantes antes de la cita", "Retirar lentes de contacto"],
    aftercare: ["Evitar el contacto con agua por 24hs", "No usar máscara de pestañas al agua", "Cepillar diariamente con cepillo de pestañas"],
    image: IMAGES.categories.pestanas,
    duration: 120,
    price: 2000,
    deposit: 500,
    rating: 4.9,
    reviewCount: 128,
    stylistIds: ["st-1", "st-2", "st-3"],
    active: true,
    materials: [
      { productId: "p-1", expectedQty: 0.3, unit: "ml" },
      { productId: "p-2", expectedQty: 1, unit: "par" },
      { productId: "p-3", expectedQty: 2, unit: "unid" },
      { productId: "p-4", expectedQty: 12, unit: "clusters" },
    ],
  },
  {
    id: "svc-2",
    slug: "extensiones-volumen-ruso",
    name: "Extensiones Volumen Ruso",
    category: "Extensiones de pestañas",
    description: "Múltiples extensiones ultra finas por pestaña para un volumen dramático.",
    longDescription:
      "Técnica de abanicos hechos a mano con extensiones ultra finas que se aplican en cada pestaña natural, logrando un volumen denso y una mirada intensa sin perder liviandad.",
    benefits: ["Volumen dramático", "Abanicos hechos a mano", "Look editorial"],
    prep: ["Llegar sin maquillaje en los ojos", "Evitar rizador de pestañas 48hs antes"],
    aftercare: ["Evitar vapor y sauna 24hs", "Dormir boca arriba las primeras noches", "Retoque recomendado cada 3 semanas"],
    image: IMAGES.categories.pestanasAlt,
    duration: 150,
    price: 2800,
    deposit: 700,
    rating: 4.8,
    reviewCount: 94,
    stylistIds: ["st-1", "st-3"],
    active: true,
    materials: [
      { productId: "p-1", expectedQty: 0.5, unit: "ml" },
      { productId: "p-2", expectedQty: 1, unit: "par" },
      { productId: "p-3", expectedQty: 3, unit: "unid" },
      { productId: "p-5", expectedQty: 8, unit: "clusters" },
    ],
  },
  {
    id: "svc-3",
    slug: "lifting-pestanas",
    name: "Lifting de Pestañas",
    category: "Lifting y tratamientos",
    description: "Curvatura y definición de tus pestañas naturales con efecto duradero.",
    longDescription:
      "Tratamiento que curva y realza las pestañas naturales desde la raíz, creando un efecto de mirada abierta y despierta sin necesidad de extensiones. Incluye nutrición con keratina.",
    benefits: ["Realza pestañas naturales", "Duración de 6-8 semanas", "Incluye nutrición con keratina"],
    prep: ["No usar máscara de pestañas el día de la cita"],
    aftercare: ["Evitar agua y vapor por 24hs", "Aplicar aceite nutritivo cada noche"],
    image: IMAGES.categories.lifting,
    duration: 60,
    price: 1200,
    deposit: 300,
    rating: 4.9,
    reviewCount: 156,
    stylistIds: ["st-2", "st-4"],
    active: true,
    materials: [
      { productId: "p-6", expectedQty: 1, unit: "kit" },
      { productId: "p-3", expectedQty: 2, unit: "unid" },
    ],
  },
  {
    id: "svc-4",
    slug: "diseno-cejas",
    name: "Diseño de Cejas",
    category: "Cejas",
    description: "Diseño personalizado según la morfología de tu rostro.",
    longDescription:
      "Diseño y perfilado de cejas a medida, con depilación de precisión, considerando la morfología facial y las tendencias actuales, para un marco perfecto para tu mirada.",
    benefits: ["Diseño personalizado", "Resultado inmediato", "Incluye tinte opcional"],
    prep: ["No depilarse 5 días antes de la cita"],
    aftercare: ["Evitar sol directo por 24hs", "No exfoliar la zona por 48hs"],
    image: IMAGES.categories.cejas,
    duration: 45,
    price: 800,
    deposit: 200,
    rating: 4.8,
    reviewCount: 201,
    stylistIds: ["st-2", "st-3", "st-4"],
    active: true,
    materials: [
      { productId: "p-7", expectedQty: 1, unit: "unid" },
      { productId: "p-8", expectedQty: 1, unit: "ml" },
    ],
  },
  {
    id: "svc-5",
    slug: "laminado-cejas",
    name: "Laminado de Cejas",
    category: "Cejas",
    description: "Cejas prolijas, uniformes y con efecto full look por semanas.",
    longDescription:
      "Tratamiento que alisa y fija los vellos de las cejas en la dirección deseada, logrando un efecto prolijo y voluminoso tipo \"soap brows\" con una duración de hasta 6 semanas.",
    benefits: ["Efecto full brows", "Uniformidad total", "Duración de 4-6 semanas"],
    prep: ["No realizar tratamientos químicos en la zona 72hs antes"],
    aftercare: ["Evitar agua por 24hs", "Peinar diariamente con cepillo de cejas"],
    image: IMAGES.categories.cejasAlt,
    duration: 50,
    price: 950,
    deposit: 250,
    rating: 4.7,
    reviewCount: 88,
    stylistIds: ["st-2", "st-4"],
    active: true,
    materials: [
      { productId: "p-9", expectedQty: 1, unit: "kit" },
      { productId: "p-8", expectedQty: 0.5, unit: "ml" },
    ],
  },
  {
    id: "svc-6",
    slug: "tinte-cejas",
    name: "Tinte de Cejas",
    category: "Cejas",
    description: "Color uniforme y natural que realza tu mirada.",
    longDescription:
      "Coloración profesional de cejas que aporta densidad visual y uniformidad, ideal para complementar un diseño o laminado y lograr un acabado impecable.",
    benefits: ["Resultado inmediato", "Realza densidad", "Dura hasta 3 semanas"],
    prep: ["Informar alergias a tintes previamente"],
    aftercare: ["Evitar productos exfoliantes por 48hs"],
    image: IMAGES.categories.cejas,
    duration: 20,
    price: 400,
    deposit: 100,
    rating: 4.6,
    reviewCount: 64,
    stylistIds: ["st-2", "st-3", "st-4"],
    active: true,
    materials: [{ productId: "p-8", expectedQty: 0.5, unit: "ml" }],
  },
  {
    id: "svc-7",
    slug: "retiro-extensiones",
    name: "Retiro de Extensiones",
    category: "Servicios complementarios",
    description: "Remoción segura y profesional de extensiones de pestañas.",
    longDescription:
      "Procedimiento seguro para remover extensiones de pestañas sin dañar la pestaña natural, utilizando removedor especializado de uso profesional.",
    benefits: ["Cuida la pestaña natural", "Proceso rápido e indoloro"],
    prep: [],
    aftercare: ["Aplicar sérum fortalecedor por una semana"],
    image: IMAGES.categories.complementarios,
    duration: 30,
    price: 450,
    deposit: 0,
    rating: 4.8,
    reviewCount: 52,
    stylistIds: ["st-1", "st-2", "st-3", "st-4"],
    active: true,
    materials: [{ productId: "p-10", expectedQty: 3, unit: "ml" }],
  },
  {
    id: "svc-8",
    slug: "hidratacion-pestanas",
    name: "Hidratación y Sérum de Pestañas",
    category: "Servicios complementarios",
    description: "Tratamiento nutritivo que fortalece pestañas naturales.",
    longDescription:
      "Aplicación de sérum fortalecedor y masaje de nutrición para reparar y potenciar el crecimiento natural de tus pestañas entre tratamientos.",
    benefits: ["Fortalece pestañas naturales", "Estimula crecimiento", "Ideal entre tratamientos"],
    prep: [],
    aftercare: ["Aplicar sérum indicado antes de dormir"],
    image: IMAGES.categories.pestanasAlt,
    duration: 25,
    price: 500,
    deposit: 0,
    rating: 4.7,
    reviewCount: 39,
    stylistIds: ["st-1", "st-4"],
    active: true,
    materials: [{ productId: "p-11", expectedQty: 1, unit: "unid" }],
  },
];

export const STYLISTS: Stylist[] = [
  {
    id: "st-1",
    slug: "camila-rossi",
    name: "Camila Rossi",
    specialty: "Extensiones & Volumen Ruso",
    bio: "Especialista en volumen ruso con 7 años de trayectoria y formación internacional.",
    longBio:
      "Camila se especializó en Buenos Aires y Madrid en técnicas de volumen ruso y mega volumen. Le apasiona crear miradas personalizadas que resalten los rasgos naturales de cada clienta. Formadora certificada en adhesivos de alta gama.",
    experienceYears: 7,
    image: IMAGES.stylists[0],
    rating: 4.9,
    reviewCount: 212,
    portfolio: [IMAGES.gallery[0], IMAGES.gallery[2], IMAGES.gallery[4]],
    servicesIds: ["svc-1", "svc-2", "svc-7", "svc-8"],
  },
  {
    id: "st-2",
    slug: "valentina-diaz",
    name: "Valentina Díaz",
    specialty: "Cejas & Laminado",
    bio: "Diseñadora de cejas reconocida por su precisión y mirada artística.",
    longBio:
      "Valentina lleva más de 5 años diseñando cejas a medida. Su enfoque combina la simetría facial con las tendencias actuales, logrando resultados naturales y favorecedores para cada rostro.",
    experienceYears: 5,
    image: IMAGES.stylists[1],
    rating: 4.8,
    reviewCount: 178,
    portfolio: [IMAGES.gallery[1], IMAGES.gallery[3], IMAGES.gallery[5]],
    servicesIds: ["svc-3", "svc-4", "svc-5", "svc-6", "svc-7"],
  },
  {
    id: "st-3",
    slug: "sofia-martinez",
    name: "Sofía Martínez",
    specialty: "Lash Artist Senior",
    bio: "Lash artist senior enfocada en técnicas clásicas y mixtas de alta precisión.",
    longBio:
      "Sofía combina más de 6 años de experiencia con un ojo meticuloso para la simetría y el detalle. Se especializa en adaptar cada técnica al tipo de pestaña natural de la clienta.",
    experienceYears: 6,
    image: IMAGES.stylists[2],
    rating: 4.9,
    reviewCount: 165,
    portfolio: [IMAGES.gallery[2], IMAGES.gallery[0], IMAGES.gallery[1]],
    servicesIds: ["svc-1", "svc-2", "svc-4", "svc-6", "svc-7"],
  },
  {
    id: "st-4",
    slug: "martina-fernandez",
    name: "Martina Fernández",
    specialty: "Lifting & Tratamientos",
    bio: "Experta en lifting de pestañas y laminado de cejas con enfoque en cuidado natural.",
    longBio:
      "Martina se formó en técnicas scandinavas de lifting y laminado. Cree en realzar la belleza natural de cada clienta combinando tratamientos de nutrición y diseño sutil.",
    experienceYears: 4,
    image: IMAGES.stylists[3],
    rating: 4.7,
    reviewCount: 102,
    portfolio: [IMAGES.gallery[3], IMAGES.gallery[4], IMAGES.gallery[5]],
    servicesIds: ["svc-3", "svc-4", "svc-5", "svc-6", "svc-8"],
  },
];

export const CUSTOMERS: Customer[] = [
  { id: "cu-1", name: "Lucía Fernández", email: "lucia.fernandez@mail.com", phone: "+598 99 123 456", status: "VIP", totalVisits: 18, totalSpent: 32400, lastVisit: "2026-01-28", preferredService: "Volumen Ruso", preferredStylist: "Camila Rossi", tags: ["VIP", "Puntual"] },
  { id: "cu-2", name: "Agustina López", email: "agustina.lopez@mail.com", phone: "+598 99 234 567", status: "Activo", totalVisits: 9, totalSpent: 14200, lastVisit: "2026-02-02", preferredService: "Lifting de Pestañas", preferredStylist: "Martina Fernández", tags: ["Recurrente"] },
  { id: "cu-3", name: "Valeria Castro", email: "valeria.castro@mail.com", phone: "+598 99 345 678", status: "Nuevo", totalVisits: 1, totalSpent: 2000, lastVisit: "2026-02-10", preferredService: "Extensiones Clásicas", tags: ["Primera visita"] },
  { id: "cu-4", name: "Florencia Suárez", email: "florencia.suarez@mail.com", phone: "+598 99 456 789", status: "Activo", totalVisits: 6, totalSpent: 9800, lastVisit: "2026-01-20", preferredService: "Diseño de Cejas", preferredStylist: "Valentina Díaz", tags: [] },
  { id: "cu-5", name: "Camila Rodríguez", email: "camila.rodriguez@mail.com", phone: "+598 99 567 890", status: "Inactivo", totalVisits: 3, totalSpent: 5400, lastVisit: "2025-09-14", preferredService: "Laminado de Cejas", tags: ["Reactivar"] },
  { id: "cu-6", name: "Martina Pereyra", email: "martina.pereyra@mail.com", phone: "+598 99 678 901", status: "VIP", totalVisits: 24, totalSpent: 48600, lastVisit: "2026-02-05", preferredService: "Volumen Ruso", preferredStylist: "Camila Rossi", tags: ["VIP", "Referidora"] },
  { id: "cu-7", name: "Sol Ramírez", email: "sol.ramirez@mail.com", phone: "+598 99 789 012", status: "Activo", totalVisits: 5, totalSpent: 7600, lastVisit: "2026-01-30", preferredService: "Tinte de Cejas", tags: [] },
  { id: "cu-8", name: "Daniela Pintos", email: "daniela.pintos@mail.com", phone: "+598 99 890 123", status: "Nuevo", totalVisits: 1, totalSpent: 1200, lastVisit: "2026-02-08", preferredService: "Lifting de Pestañas", tags: ["Primera visita"] },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "ap-1", reference: "RES-10231", customerId: "cu-1", customerName: "Lucía Fernández", serviceId: "svc-2", serviceName: "Extensiones Volumen Ruso", stylistId: "st-1", stylistName: "Camila Rossi", date: "2026-02-12", time: "10:00", duration: 150, price: 2800, paid: 700, remaining: 2100, paymentStatus: "Seña pagada", status: "Confirmada" },
  { id: "ap-2", reference: "RES-10232", customerId: "cu-2", customerName: "Agustina López", serviceId: "svc-3", serviceName: "Lifting de Pestañas", stylistId: "st-4", stylistName: "Martina Fernández", date: "2026-02-12", time: "12:30", duration: 60, price: 1200, paid: 1200, remaining: 0, paymentStatus: "Pagado completo", status: "Confirmada" },
  { id: "ap-3", reference: "RES-10233", customerId: "cu-3", customerName: "Valeria Castro", serviceId: "svc-1", serviceName: "Extensiones Clásicas", stylistId: "st-3", stylistName: "Sofía Martínez", date: "2026-02-12", time: "15:00", duration: 120, price: 2000, paid: 500, remaining: 1500, paymentStatus: "Seña pagada", status: "Pendiente" },
  { id: "ap-4", reference: "RES-10234", customerId: "cu-4", customerName: "Florencia Suárez", serviceId: "svc-4", serviceName: "Diseño de Cejas", stylistId: "st-2", stylistName: "Valentina Díaz", date: "2026-02-13", time: "09:30", duration: 45, price: 800, paid: 800, remaining: 0, paymentStatus: "Pagado completo", status: "Completada" },
  { id: "ap-5", reference: "RES-10235", customerId: "cu-6", customerName: "Martina Pereyra", serviceId: "svc-2", serviceName: "Extensiones Volumen Ruso", stylistId: "st-1", stylistName: "Camila Rossi", date: "2026-02-13", time: "11:00", duration: 150, price: 2800, paid: 2800, remaining: 0, paymentStatus: "Pagado completo", status: "Completada" },
  { id: "ap-6", reference: "RES-10236", customerId: "cu-7", customerName: "Sol Ramírez", serviceId: "svc-6", serviceName: "Tinte de Cejas", stylistId: "st-3", stylistName: "Sofía Martínez", date: "2026-02-13", time: "14:00", duration: 20, price: 400, paid: 0, remaining: 400, paymentStatus: "Pendiente", status: "No show" },
  { id: "ap-7", reference: "RES-10237", customerId: "cu-8", customerName: "Daniela Pintos", serviceId: "svc-3", serviceName: "Lifting de Pestañas", stylistId: "st-4", stylistName: "Martina Fernández", date: "2026-02-14", time: "16:30", duration: 60, price: 1200, paid: 300, remaining: 900, paymentStatus: "Seña pagada", status: "Confirmada" },
  { id: "ap-8", reference: "RES-10238", customerId: "cu-5", customerName: "Camila Rodríguez", serviceId: "svc-5", serviceName: "Laminado de Cejas", stylistId: "st-2", stylistName: "Valentina Díaz", date: "2026-02-14", time: "10:00", duration: 50, price: 950, paid: 950, remaining: 0, paymentStatus: "Pagado completo", status: "Cancelada" },
  { id: "ap-9", reference: "RES-10239", customerId: "cu-1", customerName: "Lucía Fernández", serviceId: "svc-7", serviceName: "Retiro de Extensiones", stylistId: "st-1", stylistName: "Camila Rossi", date: "2026-01-15", time: "09:00", duration: 30, price: 450, paid: 450, remaining: 0, paymentStatus: "Pagado completo", status: "Completada" },
  { id: "ap-10", reference: "RES-10240", customerId: "cu-2", customerName: "Agustina López", serviceId: "svc-4", serviceName: "Diseño de Cejas", stylistId: "st-2", stylistName: "Valentina Díaz", date: "2026-02-18", time: "13:00", duration: 45, price: 800, paid: 200, remaining: 600, paymentStatus: "Seña pagada", status: "Confirmada" },
];

export const PRODUCTS: Product[] = [
  { id: "p-1", name: "Adhesivo Profesional Lash", image: IMAGES.products[0], sku: "ADH-001", category: "Pestañas", brand: "LashPro", supplierId: "sup-1", purchasePrice: 500, landedUnitCost: 550, sellingPrice: 0, stock: 14, minStock: 5, unit: "ml", expiration: "2026-08-01" },
  { id: "p-2", name: "Almohadillas de Gel (par)", image: IMAGES.products[1], sku: "GEL-002", category: "Pestañas", brand: "EyeCare", supplierId: "sup-1", purchasePrice: 100, landedUnitCost: 110, sellingPrice: 0, stock: 40, minStock: 15, unit: "par" },
  { id: "p-3", name: "Microbrush x100", image: IMAGES.products[2], sku: "MB-003", category: "Insumos", brand: "ProTools", supplierId: "sup-2", purchasePrice: 250, landedUnitCost: 270, sellingPrice: 0, stock: 8, minStock: 10, unit: "paquete" },
  { id: "p-4", name: "Clusters Clásicos C-Curl", image: IMAGES.products[3], sku: "CLU-004", category: "Pestañas", brand: "LashPro", supplierId: "sup-1", purchasePrice: 650, landedUnitCost: 690, sellingPrice: 0, stock: 22, minStock: 8, unit: "caja" },
  { id: "p-5", name: "Clusters Volumen Ruso", image: IMAGES.products[4], sku: "CLU-005", category: "Pestañas", brand: "LashPro", supplierId: "sup-1", purchasePrice: 780, landedUnitCost: 830, sellingPrice: 0, stock: 6, minStock: 8, unit: "caja" },
  { id: "p-6", name: "Kit Lifting de Pestañas", image: IMAGES.products[5], sku: "LIF-006", category: "Lifting", brand: "CurlUp", supplierId: "sup-3", purchasePrice: 1800, landedUnitCost: 1950, sellingPrice: 0, stock: 5, minStock: 4, unit: "kit" },
  { id: "p-7", name: "Cera Depilatoria Cejas", image: IMAGES.products[0], sku: "CER-007", category: "Cejas", brand: "BrowLine", supplierId: "sup-2", purchasePrice: 320, landedUnitCost: 340, sellingPrice: 0, stock: 12, minStock: 5, unit: "kg" },
  { id: "p-8", name: "Tinte para Cejas", image: IMAGES.products[1], sku: "TIN-008", category: "Cejas", brand: "BrowLine", supplierId: "sup-2", purchasePrice: 450, landedUnitCost: 480, sellingPrice: 0, stock: 9, minStock: 6, unit: "ml" },
  { id: "p-9", name: "Kit Laminado de Cejas", image: IMAGES.products[2], sku: "LAM-009", category: "Cejas", brand: "BrowLine", supplierId: "sup-2", purchasePrice: 1600, landedUnitCost: 1720, sellingPrice: 0, stock: 3, minStock: 4, unit: "kit" },
  { id: "p-10", name: "Removedor de Extensiones", image: IMAGES.products[3], sku: "REM-010", category: "Pestañas", brand: "LashPro", supplierId: "sup-1", purchasePrice: 400, landedUnitCost: 430, sellingPrice: 0, stock: 11, minStock: 5, unit: "ml" },
  { id: "p-11", name: "Sérum Fortalecedor de Pestañas", image: IMAGES.products[4], sku: "SER-011", category: "Cuidado", brand: "LashCare", supplierId: "sup-3", purchasePrice: 900, landedUnitCost: 960, sellingPrice: 1400, stock: 17, minStock: 6, unit: "unid" },
];

export const SUPPLIERS: Supplier[] = [
  { id: "sup-1", name: "LashPro Uruguay", contact: "Fernanda Díaz", phone: "+598 2 711 2233", email: "ventas@lashpro.uy", category: "Pestañas", outstandingBalance: 4200, lastPurchase: "2026-01-28" },
  { id: "sup-2", name: "BrowLine Distribuidora", contact: "Martín Acosta", phone: "+598 2 622 1144", email: "pedidos@browline.uy", category: "Cejas", outstandingBalance: 0, lastPurchase: "2026-01-15" },
  { id: "sup-3", name: "CurlUp Importadora", contact: "Rocío Paz", phone: "+598 2 400 5566", email: "info@curlup.com", category: "Tratamientos", outstandingBalance: 1950, lastPurchase: "2026-02-01" },
];

export const PURCHASES: Purchase[] = [
  {
    id: "pu-1",
    supplierId: "sup-1",
    date: "2026-01-28",
    invoice: "A-0004521",
    currency: "UYU",
    paymentStatus: "Pagado",
    items: [
      { productId: "p-1", quantity: 10, unitPrice: 500 },
      { productId: "p-2", quantity: 20, unitPrice: 100 },
    ],
    expenses: [
      { id: "e-1", category: "Transporte", description: "Flete a domicilio", amount: 600 },
      { id: "e-2", category: "Embalaje", description: "Cajas y protección", amount: 100 },
    ],
    allocationMethod: "value",
  },
  {
    id: "pu-2",
    supplierId: "sup-2",
    date: "2026-01-15",
    invoice: "B-0012044",
    currency: "UYU",
    paymentStatus: "Pagado",
    items: [
      { productId: "p-7", quantity: 8, unitPrice: 320 },
      { productId: "p-8", quantity: 12, unitPrice: 450 },
    ],
    expenses: [{ id: "e-3", category: "Transporte", description: "Envío estándar", amount: 350 }],
    allocationMethod: "quantity",
  },
  {
    id: "pu-3",
    supplierId: "sup-3",
    date: "2026-02-01",
    invoice: "C-0003310",
    currency: "UYU",
    paymentStatus: "Parcial",
    items: [
      { productId: "p-6", quantity: 6, unitPrice: 1800 },
      { productId: "p-11", quantity: 15, unitPrice: 900 },
    ],
    expenses: [
      { id: "e-4", category: "Aduana", description: "Despacho de importación", amount: 900 },
      { id: "e-5", category: "Seguro", description: "Seguro de transporte", amount: 150 },
    ],
    allocationMethod: "value",
  },
];

export const EXPENSES: Expense[] = [
  { id: "ex-1", description: "Alquiler local", category: "Alquiler", amount: 45000, date: "2026-02-01", vendor: "Inmobiliaria Centro", method: "Transferencia", status: "Pagado", recurring: true },
  { id: "ex-2", description: "UTE febrero", category: "Electricidad", amount: 6200, date: "2026-02-03", vendor: "UTE", method: "Transferencia", status: "Pagado", recurring: true },
  { id: "ex-3", description: "Internet y teléfono", category: "Internet", amount: 1890, date: "2026-02-03", vendor: "Antel", method: "Tarjeta", status: "Pagado", recurring: true },
  { id: "ex-4", description: "Sueldos del equipo", category: "Salarios", amount: 98000, date: "2026-02-05", vendor: "Nómina", method: "Transferencia", status: "Pagado", recurring: true },
  { id: "ex-5", description: "Campaña Instagram Ads", category: "Marketing", amount: 5400, date: "2026-02-06", vendor: "Meta Ads", method: "Tarjeta", status: "Pagado", recurring: false },
  { id: "ex-6", description: "Compra LashPro Uruguay", category: "Inventario", amount: 5700, date: "2026-01-28", vendor: "LashPro Uruguay", method: "Transferencia", status: "Pagado", recurring: false, linkedPurchaseId: "pu-1" },
  { id: "ex-7", description: "Mantenimiento sillones", category: "Mantenimiento", amount: 2100, date: "2026-01-20", vendor: "Taller Lucas", method: "Efectivo", status: "Pendiente", recurring: false },
  { id: "ex-8", description: "Software de gestión", category: "Software", amount: 1200, date: "2026-02-01", vendor: "SalonSoft", method: "Tarjeta", status: "Pagado", recurring: true },
];

export const REVIEWS: Review[] = [
  { id: "rv-1", customerName: "Lucía F.", rating: 5, serviceQuality: 5, professionalism: 5, experience: 5, date: "2026-02-01", serviceName: "Extensiones Volumen Ruso", stylistName: "Camila Rossi", comment: "Increíble experiencia, Camila es una artista. Mis pestañas quedaron espectaculares y muy naturales a la vez.", verified: true, status: "Publicada", response: "¡Gracias Lucía! Nos encanta que hayas disfrutado la experiencia 💕" },
  { id: "rv-2", customerName: "Agustina L.", rating: 5, serviceQuality: 5, professionalism: 4, experience: 5, date: "2026-01-29", serviceName: "Lifting de Pestañas", stylistName: "Martina Fernández", comment: "El local es hermoso y el trato espectacular. Mi mirada se ve totalmente renovada.", verified: true, status: "Publicada" },
  { id: "rv-3", customerName: "Florencia S.", rating: 4, serviceQuality: 4, professionalism: 5, experience: 4, date: "2026-01-25", serviceName: "Diseño de Cejas", stylistName: "Valentina Díaz", comment: "Muy conforme con el diseño, aunque esperé un poco más de lo previsto.", verified: true, status: "Publicada" },
  { id: "rv-4", customerName: "Martina P.", rating: 5, serviceQuality: 5, professionalism: 5, experience: 5, date: "2026-02-05", serviceName: "Extensiones Volumen Ruso", stylistName: "Camila Rossi", comment: "Voy hace más de un año y siempre impecable. ¡Las recomiendo totalmente!", verified: true, status: "Publicada" },
  { id: "rv-5", customerName: "Sol R.", rating: 3, serviceQuality: 3, professionalism: 4, experience: 3, date: "2026-02-08", serviceName: "Tinte de Cejas", stylistName: "Sofía Martínez", comment: "Estuvo bien pero el color se fue un poco antes de lo esperado.", verified: true, status: "Nueva" },
  { id: "rv-6", customerName: "Daniela P.", rating: 5, serviceQuality: 5, professionalism: 5, experience: 5, date: "2026-02-09", serviceName: "Lifting de Pestañas", stylistName: "Martina Fernández", comment: "Primera vez y no será la última. Excelente atención de principio a fin.", verified: true, status: "Nueva" },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "cv-1",
    customerName: "Lucía Fernández",
    lastMessage: "¡Perfecto, nos vemos el jueves!",
    lastTime: "09:41",
    unread: 0,
    status: "Abierta",
    assignedTo: "Recepción",
    messages: [
      { id: "m1", sender: "customer", text: "Hola! Quería confirmar mi cita del jueves", time: "09:30", read: true },
      { id: "m2", sender: "salon", text: "¡Hola Lucía! Sí, tu cita de Volumen Ruso con Camila está confirmada para el jueves 10:00hs", time: "09:35", read: true },
      { id: "m3", sender: "customer", text: "¡Perfecto, nos vemos el jueves!", time: "09:41", read: true },
    ],
  },
  {
    id: "cv-2",
    customerName: "Valeria Castro",
    lastMessage: "¿Puedo pagar la seña por transferencia?",
    lastTime: "08:15",
    unread: 2,
    status: "Abierta",
    assignedTo: "Sin asignar",
    messages: [
      { id: "m1", sender: "customer", text: "Hola, es mi primera vez reservando", time: "08:10" , read: true},
      { id: "m2", sender: "customer", text: "¿Puedo pagar la seña por transferencia?", time: "08:15", read: false },
    ],
  },
  {
    id: "cv-3",
    customerName: "Sol Ramírez",
    lastMessage: "Gracias por la respuesta rápida 🙏",
    lastTime: "ayer",
    unread: 0,
    status: "Resuelta",
    assignedTo: "Recepción",
    messages: [
      { id: "m1", sender: "customer", text: "¿El tinte de cejas dura mucho?", time: "ayer" },
      { id: "m2", sender: "salon", text: "Suele durar entre 2 y 3 semanas según el tipo de piel", time: "ayer" },
      { id: "m3", sender: "customer", text: "Gracias por la respuesta rápida 🙏", time: "ayer" },
    ],
  },
  {
    id: "cv-4",
    customerName: "Daniela Pintos",
    lastMessage: "Buenas! ¿tienen turnos para mañana?",
    lastTime: "10:02",
    unread: 1,
    status: "Abierta",
    assignedTo: "Sin asignar",
    messages: [{ id: "m1", sender: "customer", text: "Buenas! ¿tienen turnos para mañana?", time: "10:02", read: false }],
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n-1", type: "payment", title: "Seña recibida", description: "Valeria Castro pagó la seña de $500 para Extensiones Clásicas", time: "Hace 10 min", read: false },
  { id: "n-2", type: "appointment", title: "Nueva reserva", description: "Daniela Pintos reservó Lifting de Pestañas para el 14/02", time: "Hace 25 min", read: false },
  { id: "n-3", type: "review", title: "Nueva opinión", description: "Sol Ramírez dejó una opinión de 3 estrellas", time: "Hace 1 h", read: false },
  { id: "n-4", type: "inventory", title: "Stock bajo", description: "Microbrush x100 está por debajo del mínimo (8/10)", time: "Hace 2 h", read: true },
  { id: "n-5", type: "message", title: "Nuevo mensaje", description: "Valeria Castro preguntó por el pago de la seña", time: "Hace 3 h", read: true },
  { id: "n-6", type: "commission", title: "Comisión registrada", description: "Camila Rossi generó $840 en comisiones esta semana", time: "Hace 5 h", read: true },
];

export const EMPLOYEES: Employee[] = [
  { id: "emp-1", name: "Camila Rossi", role: "Especialista", image: IMAGES.stylists[0], specialties: ["Volumen Ruso", "Clásicas"], schedule: "Lun-Vie 9:00-18:00", revenueGenerated: 86400, appointmentsCompleted: 112, rating: 4.9, commissionRate: 30, commissionPaid: 21400, commissionPending: 3600 },
  { id: "emp-2", name: "Valentina Díaz", role: "Especialista", image: IMAGES.stylists[1], specialties: ["Cejas", "Laminado"], schedule: "Mar-Sáb 10:00-19:00", revenueGenerated: 54200, appointmentsCompleted: 148, rating: 4.8, commissionRate: 28, commissionPaid: 14100, commissionPending: 2100 },
  { id: "emp-3", name: "Sofía Martínez", role: "Especialista", image: IMAGES.stylists[2], specialties: ["Clásicas", "Mixtas"], schedule: "Lun-Vie 11:00-20:00", revenueGenerated: 61800, appointmentsCompleted: 97, rating: 4.9, commissionRate: 30, commissionPaid: 16900, commissionPending: 1800 },
  { id: "emp-4", name: "Martina Fernández", role: "Especialista", image: IMAGES.stylists[3], specialties: ["Lifting", "Laminado"], schedule: "Mié-Dom 9:00-17:00", revenueGenerated: 38600, appointmentsCompleted: 121, rating: 4.7, commissionRate: 25, commissionPaid: 9200, commissionPending: 1400 },
  { id: "emp-5", name: "Rocío Benítez", role: "Recepción", image: IMAGES.stylists[4], specialties: ["Atención al cliente"], schedule: "Lun-Sáb 9:00-19:00", revenueGenerated: 0, appointmentsCompleted: 0, rating: 0, commissionRate: 0, commissionPaid: 0, commissionPending: 0 },
];

export const MATERIAL_RECIPES_NOTE =
  "Cada servicio tiene una receta estándar de consumo de materiales que se confirma al finalizar la cita.";

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}
export function getStylist(id: string) {
  return STYLISTS.find((s) => s.id === id);
}
