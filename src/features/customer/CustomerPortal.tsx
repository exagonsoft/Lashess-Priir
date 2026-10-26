"use client";
import Profile from "@/features/auth/Profile";
import { useAuth } from "@/features/auth/AuthProvider";
import Ledger from "@/features/data/Ledger";
import Messenger from "@/features/data/Messenger";
import { useLiveData } from "@/features/data/LiveData";
import { useState } from "react";
import { Link } from "@/lib/navigation";
import PortalShell, { NavGroup, Icon, ICONS, PageHeader } from "../../components/layout/PortalShell";
import { formatUYU } from "../../data/source";
import { Button, Badge, statusTone, Card, StarRating, Modal, Textarea, Avatar, EmptyState } from "../../components/ui";

const groups: NavGroup[] = [
  {
    items: [
      { to: "/cuenta", label: "Mi resumen", icon: <Icon d={ICONS.dashboard} /> },
      { to: "/cuenta/reservas", label: "Mis reservas", icon: <Icon d={ICONS.calendar} /> },
      { to: "/cuenta/historial", label: "Historial", icon: <Icon d={ICONS.receipt} /> },
      { to: "/cuenta/pagos", label: "Mis pagos", icon: <Icon d={ICONS.credit} /> },
      { to: "/cuenta/opiniones", label: "Mis opiniones", icon: <Icon d={ICONS.star} /> },
      { to: "/cuenta/mensajes", label: "Mensajes", icon: <Icon d={ICONS.message} /> },
      { to: "/cuenta/perfil", label: "Mi perfil", icon: <Icon d={ICONS.users} /> },
    ],
  },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell title="Mi cuenta" groups={groups} roleLabel="Clienta VIP" roleName="Lucía Fernández">
      {children}
    </PortalShell>
  );
}


export function CustomerOverview() {
 const {me}=useAuth();
  const { STYLISTS, APPOINTMENTS } = useLiveData();
  const myAppointments = APPOINTMENTS;

  const upcoming = myAppointments.find((a) => a.status === "Confirmada" || a.status === "Pendiente");
  return (
    <Shell>
      <PageHeader title={"¡Hola, "+(me?.profile.displayName||"bienvenida")+"!"} description="Este es el resumen de tu actividad en lashess-priir." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Próxima cita</p>
          {upcoming ? (
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-2xl text-plum">{upcoming.serviceName}</p>
                <p className="text-sm text-muted">
                  {upcoming.date} · {upcoming.time} con {upcoming.stylistName}
                </p>
                <Badge tone={statusTone(upcoming.status)} className="mt-2">
                  {upcoming.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Saldo pendiente</p>
                <p className="font-display text-xl text-deep-rose">No disponible</p>
              </div>
            </div>
          ) : (
            <EmptyState title="No tenés citas próximas" description="Reservá tu próximo tratamiento." />
          )}
          <Link to="/reservar">
            <Button className="mt-5">Reservar nueva cita</Button>
          </Link>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Equipo del salón</p>
          <div className="mt-3 flex items-center gap-3">
            <Avatar src={STYLISTS[0]?.image} name={(STYLISTS[0]?.name??"Sin especialista seleccionada")} size={48} />
            <div>
              <p className="font-semibold text-plum">{(STYLISTS[0]?.name??"Sin especialista seleccionada")}</p>
              <p className="text-xs text-muted">{STYLISTS[0]?.specialty}</p>
            </div>
          </div>
          <Link to={`/especialistas/${(STYLISTS[0]?.slug??"")}`}>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Ver perfil
            </Button>
          </Link>
        </Card>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Pagos recientes</p>
          <p className="mt-2 font-display text-2xl text-plum">No disponible</p>
          <p className="text-xs text-muted">Consultar el registro de pagos</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Mensajes sin leer</p>
          <p className="mt-2 font-display text-2xl text-plum">0</p>
          <p className="text-xs text-muted">Todo al día</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Visitas totales</p>
          <p className="mt-2 font-display text-2xl text-plum">{myAppointments.filter(a=>a.status==="Completada").length}</p>
          <p className="text-xs text-muted">Citas completadas en esta página</p>
        </Card>
      </div>
    </Shell>
  );
}

export function CustomerReservations() {
  const { APPOINTMENTS } = useLiveData();
  const myAppointments = APPOINTMENTS;

  const [cancelId, setCancelId] = useState<string | null>(null);
  const upcoming = myAppointments.filter((a) => ["Pendiente", "Confirmada"].includes(a.status));
  return (
    <Shell>
      <PageHeader title="Mis reservas" description="Gestioná tus próximas citas." actions={<Link to="/reservar"><Button>Nueva reserva</Button></Link>} />
      <div className="space-y-4">
        {upcoming.map((a) => (
          <Card key={a.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg text-plum">{a.serviceName}</p>
              <p className="text-sm text-muted">
                {a.date} · {a.time} con {a.stylistName}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                <Badge tone={statusTone(a.paymentStatus)}>{a.paymentStatus}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button disabled title="Operación pendiente de implementación segura" variant="outline" size="sm">
                Reprogramar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setCancelId(a.id)}>
                Cancelar
              </Button>
            </div>
          </Card>
        ))}
        {upcoming.length === 0 && <EmptyState title="No tenés reservas activas" />}
      </div>
      <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Cancelar reserva" footer={
        <>
          <Button variant="ghost" onClick={() => setCancelId(null)}>Volver</Button>
          <Button disabled title="Operación pendiente de implementación segura" variant="destructive" onClick={() => setCancelId(null)}>Confirmar cancelación</Button>
        </>
      }>
        <p className="text-sm text-plum/80">¿Segura que querés cancelar esta reserva? Esta acción no se puede deshacer y se aplicará la política de cancelación vigente.</p>
      </Modal>
    </Shell>
  );
}

export function CustomerHistory() {
  const { APPOINTMENTS } = useLiveData();
  const myAppointments = APPOINTMENTS;

  const past = myAppointments.filter((a) => ["Completada", "Cancelada", "No show"].includes(a.status));
  return (
    <Shell>
      <PageHeader title="Historial de citas" description="Tus tratamientos anteriores en lashess-priir." />
      <div className="overflow-x-auto rounded-xl border border-border-soft bg-white">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Especialista</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {past.map((a) => (
              <tr key={a.id} className="border-t border-border-soft">
                <td className="px-4 py-3 font-medium text-plum">{a.serviceName}</td>
                <td className="px-4 py-3 text-muted">{a.stylistName}</td>
                <td className="px-4 py-3 text-muted">{a.date}</td>
                <td className="px-4 py-3 text-muted">{formatUYU(a.price)}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

export function CustomerPayments() {return <Shell><PageHeader title="Mis pagos" description="Registros financieros del salón."/><Ledger kind="PAYMENTS"/></Shell>;}

export function CustomerReviews() {
  const { REVIEWS } = useLiveData();

  const [open, setOpen] = useState(false);
  return (
    <Shell>
      <PageHeader title="Mis opiniones" description="Reseñas enviadas y citas elegibles para calificar." actions={<Button disabled title="Operación pendiente de implementación segura" onClick={() => setOpen(true)}>Dejar opinión</Button>} />
      <div className="space-y-4">
        {REVIEWS.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <StarRating value={r.rating} readOnly />
              <span className="text-xs text-muted">{r.date}</span>
            </div>
            <p className="mt-2 text-sm text-plum/80">{r.comment}</p>
            <p className="mt-2 text-xs text-muted">{r.serviceName} con {r.stylistName}</p>
            {r.response && <div className="mt-2 rounded-lg bg-blush/30 p-3 text-xs text-plum/80">Respuesta: {r.response}</div>}
          </Card>
        ))}
        <Card className="p-5">
          <p className="text-sm font-semibold text-plum">Pendiente de calificar</p>
          <p className="text-xs text-muted">La publicación requiere una cita real completada.</p>
          <Button disabled title="Operación pendiente de implementación segura" size="sm" className="mt-3" onClick={() => setOpen(true)}>
            Calificar ahora
          </Button>
        </Card>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Dejar una opinión" footer={<Button disabled title="Operación pendiente de implementación segura" onClick={() => setOpen(false)}>Enviar opinión</Button>}>
        <div className="space-y-4">
          <StarRating value={5} size={26} />
          <Textarea rows={4} placeholder="Contanos tu experiencia..." />
        </div>
      </Modal>
    </Shell>
  );
}

export function CustomerMessages() {return <Shell><PageHeader title="Mis mensajes" description="Conversaciones de lashess-priir."/><Messenger/></Shell>;}

export function CustomerProfile() { return <Shell><Profile/></Shell>; }
