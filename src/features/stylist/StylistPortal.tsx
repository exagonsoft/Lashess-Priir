"use client";
import Profile from "@/features/auth/Profile";
import { useAuth } from "@/features/auth/AuthProvider";
import { salonDate } from "@/lib/record-mapping";
import Ledger from "@/features/data/Ledger";
import Messenger from "@/features/data/Messenger";
import { useLiveData } from "@/features/data/LiveData";
import { useState } from "react";
import PortalShell, { NavGroup, Icon, ICONS, PageHeader } from "../../components/layout/PortalShell";
import { formatUYU } from "../../data/source";
import { Button, Badge, statusTone, Card, StarRating, Avatar } from "../../components/ui";
import CompletionDrawer from "../crm/CompletionDrawer";

const groups: NavGroup[] = [
  {
    items: [
      { to: "/staff", label: "Mi resumen", icon: <Icon d={ICONS.dashboard} /> },
      { to: "/staff/agenda", label: "Mi agenda", icon: <Icon d={ICONS.calendar} /> },
      { to: "/staff/clientes", label: "Mis clientes", icon: <Icon d={ICONS.users} /> },
      { to: "/staff/servicios", label: "Servicios", icon: <Icon d={ICONS.scissors} /> },
      { to: "/staff/comisiones", label: "Comisiones", icon: <Icon d={ICONS.percent} /> },
      { to: "/staff/opiniones", label: "Opiniones", icon: <Icon d={ICONS.star} /> },
      { to: "/staff/mensajes", label: "Mensajes", icon: <Icon d={ICONS.message} /> },
      { to: "/staff/perfil", label: "Mi perfil", icon: <Icon d={ICONS.users} /> },
    ],
  },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell title="Panel especialista" groups={groups} roleLabel="Lash Artist Senior" roleName="Camila Rossi">
      {children}
    </PortalShell>
  );
}


export function StylistOverview() {
 const {me}=useAuth();
  const { APPOINTMENTS } = useLiveData();
  const myAppointments = APPOINTMENTS;

  const today = myAppointments.filter((a) => a.date === salonDate(new Date().toISOString()));
  return (
    <Shell>
      <PageHeader title={"¡Hola, "+(me?.profile.displayName||"especialista")+"!"} description="Resumen de tu actividad de hoy." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase text-muted">Citas hoy</p>
          <p className="mt-1 font-display text-2xl text-plum">{today.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase text-muted">Ingresos generados (mes)</p>
          <p className="mt-1 font-display text-2xl text-plum">No disponible</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase text-muted">Valoración</p>
          <p className="mt-1 font-display text-2xl text-plum">Sin valoración calculada</p>
        </Card>
      </div>
      <h3 className="mb-3 mt-8 font-display text-xl text-plum">Agenda de hoy</h3>
      <div className="space-y-3">
        {myAppointments.map((a) => (
          <Card key={a.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-plum">
                {a.time} · {a.serviceName}
              </p>
              <p className="text-xs text-muted">Clienta: {a.customerName}</p>
            </div>
            <Badge tone={statusTone(a.status)}>{a.status}</Badge>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

export function StylistAgenda() {
  const { APPOINTMENTS } = useLiveData();
  const myAppointments = APPOINTMENTS;

  const [completing, setCompleting] = useState<string | null>(null);
  return (
    <Shell>
      <PageHeader title="Mi agenda" description="Visualizá y gestioná tus citas asignadas." />
      <div className="space-y-3">
        {myAppointments.map((a) => (
          <Card key={a.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg text-plum">{a.serviceName}</p>
              <p className="text-sm text-muted">
                {a.date} · {a.time} · {a.customerName}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                <Badge tone={statusTone(a.paymentStatus)}>{a.paymentStatus}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {a.status !== "Completada" && a.status !== "Cancelada" && (
                <Button size="sm" onClick={() => setCompleting(a.id)}>
                  Ver materiales
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      <CompletionDrawer
        appointmentId={completing}
        onClose={() => setCompleting(null)}
      />
    </Shell>
  );
}

export function StylistClients() {
  const { CUSTOMERS } = useLiveData();

  const myClients = CUSTOMERS;
  return (
    <Shell>
      <PageHeader title="Mis clientes" description="Clientas que atendiste recientemente." />
      <div className="overflow-x-auto rounded-xl border border-border-soft bg-white">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Clienta</th>
              <th className="px-4 py-3">Última visita</th>
              <th className="px-4 py-3">Visitas</th>
              <th className="px-4 py-3">Servicio preferido</th>
            </tr>
          </thead>
          <tbody>
            {myClients.map((c) => (
              <tr key={c.id} className="border-t border-border-soft">
                <td className="flex items-center gap-2.5 px-4 py-3 font-medium text-plum">
                  <Avatar name={c.name} size={28} /> {c.name}
                </td>
                <td className="px-4 py-3 text-muted">{c.lastVisit}</td>
                <td className="px-4 py-3 text-muted">—</td>
                <td className="px-4 py-3 text-muted">{c.preferredService ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

export function StylistServices() {
  const { SERVICES } = useLiveData();

  const myServices = SERVICES;
  return (
    <Shell>
      <PageHeader title="Mis servicios" description="Tratamientos que estás habilitada para realizar." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {myServices.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <img src={s.image} alt={s.name} className="h-36 w-full object-cover" />
            <div className="p-4">
              <p className="font-semibold text-plum">{s.name}</p>
              <p className="mt-1 text-xs text-muted">
                {s.duration} min · {formatUYU(s.price)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

export function StylistCommissions() {return <Shell><PageHeader title="Mis comisiones" description="Registros financieros del salón."/><Ledger kind="COMMISSIONS"/></Shell>;}

export function StylistReviews() {
  const { REVIEWS } = useLiveData();

  const myReviews = REVIEWS;
  return (
    <Shell>
      <PageHeader title="Opiniones" description="Lo que dicen tus clientas sobre tu trabajo." />
      <div className="space-y-4">
        {myReviews.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <StarRating value={r.rating} readOnly />
              <span className="text-xs text-muted">{r.date}</span>
            </div>
            <p className="mt-2 text-sm text-plum/80">{r.comment}</p>
            <p className="mt-1 text-xs text-muted">{r.customerName} · {r.serviceName}</p>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

export function StylistMessages() {return <Shell><PageHeader title="Mensajes" description="Conversaciones de lashess-priir."/><Messenger/></Shell>;}

export function StylistProfile() { return <Shell><Profile/></Shell>; }


