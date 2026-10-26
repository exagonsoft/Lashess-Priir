"use client";
import { salonDate } from "@/lib/record-mapping";
import { useLiveData } from "@/features/data/LiveData";
import { useMemo, useState } from "react";
import CrmShell from "./CrmShell";
import { PageHeader, Breadcrumbs } from "../../components/layout/PortalShell";
import { Button, Badge, statusTone, Card, Select, Input, Modal, Drawer } from "../../components/ui";
import { formatUYU, Appointment } from "../../data/source";
import CompletionDrawer from "./CompletionDrawer";

const HOURS = Array.from({ length: 11 }).map((_, i) => `${9 + i}:00`);


export function CrmAgenda() {
  const [date,setDate]=useState(()=>salonDate(new Date().toISOString()));
  const [stylist,setStylist]=useState("");
  const [status,setStatus]=useState("");
  const { APPOINTMENTS, STYLISTS, SERVICES, CUSTOMERS } = useLiveData();

  const [view, setView] = useState<"Día" | "Semana" | "Mes" | "Especialista">("Semana");
  const DAYS=Array.from({length:view==="Mes"?new Date(Number(date.slice(0,4)),Number(date.slice(5,7)),0).getDate():view==="Día"?1:7},(_,i)=>{const d=new Date((view==="Mes"?date.slice(0,7)+"-01":date)+"T12:00:00-03:00");d.setUTCDate(d.getUTCDate()+i);return salonDate(d.toISOString());});
  const visibleAppointments=APPOINTMENTS.filter(a=>(!stylist||a.stylistId===stylist)&&(!status||a.status===status));
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);

  return (
    <CrmShell>
      <Breadcrumbs items={["Principal", "Agenda"]} />
      <PageHeader
        title="Agenda"
        description="Calendario de citas del salón."
        actions={
          <>
            <Select value={view} onChange={(e) => setView(e.target.value as any)} className="w-40">
              <option>Día</option>
              <option>Semana</option>
              <option>Mes</option><option>Especialista</option>
            </Select>
            <Button disabled title="Operación pendiente de implementación segura" onClick={() => setNewOpen(true)}>+ Nueva cita</Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3"><Input aria-label="Fecha" type="date" value={date} onChange={e=>setDate(e.target.value)}/><Select aria-label="Especialista" value={stylist} onChange={e=>setStylist(e.target.value)}><option value="">Todas las especialistas</option>{STYLISTS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Select><Select aria-label="Estado" value={status} onChange={e=>setStatus(e.target.value)}><option value="">Todos los estados</option>{["Pendiente","Confirmada","En curso","Completada","Cancelada"].map(s=><option key={s}>{s}</option>)}</Select></div><p className="mb-3 text-xs text-muted">Calendario de la página de reservas cargada. Usá la paginación para consultar más registros.</p>
      {view === "Especialista" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {STYLISTS.map((st) => (
            <Card key={st.id} className="p-5">
              <p className="mb-3 font-display text-lg text-plum">{st.name}</p>
              <div className="space-y-2">
                {visibleAppointments.filter((a) => a.stylistId === st.id).map((a) => (
                  <button key={a.id} onClick={() => setSelected(a)} className="flex w-full items-center justify-between rounded-lg border border-border-soft px-3 py-2 text-left text-sm hover:border-fashion">
                    <span>
                      {a.date} {a.time} · {a.serviceName}
                    </span>
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] border-collapse text-xs">
            <thead>
              <tr className="bg-blush/30 text-left uppercase text-muted">
                <th className="w-20 px-3 py-2">Hora</th>
                {(DAYS).map((d) => (
                  <th key={d} className="px-3 py-2">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((h) => (
                <tr key={h} className="border-t border-border-soft">
                  <td className="px-3 py-2 font-medium text-muted">{h}</td>
                  {(DAYS).map((d) => {
                    const apps = visibleAppointments.filter((a) => a.date === d && a.time.startsWith(h.split(":")[0].padStart(2, "0")));
                    return (
                      <td key={d} className="min-w-[180px] px-2 py-1.5 align-top">
                        {apps.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => setSelected(a)}
                            className="mb-1 block w-full rounded-md border-l-4 border-fashion bg-blush/30 px-2 py-1.5 text-left hover:bg-blush/60"
                          >
                            <p className="font-semibold text-plum">{a.time} {a.serviceName}</p>
                            <p className="text-muted">{a.customerName} · {a.stylistName}</p>
                          </button>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <AppointmentDrawer appointment={selected} onClose={() => setSelected(null)} onComplete={(id) => { setSelected(null); setCompleting(id); }} />
      <CompletionDrawer appointmentId={completing} onClose={() => setCompleting(null)} />

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="Nueva cita manual" footer={<><Button variant="ghost" onClick={() => setNewOpen(false)}>Cancelar</Button><Button disabled title="Operación pendiente de implementación segura" onClick={() => setNewOpen(false)}>Crear cita</Button></>}>
        <div className="space-y-4">
          <Select defaultValue="">
            <option value="" disabled>Clienta</option>
            {CUSTOMERS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select defaultValue="">
            <option value="" disabled>Servicio</option>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name} · {formatUYU(s.price)}</option>)}
          </Select>
          <Select defaultValue="">
            <option value="" disabled>Especialista</option>
            {STYLISTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" />
            <Input type="time" />
          </div>
        </div>
      </Modal>
    </CrmShell>
  );
}

export function CrmReservas() {
  const { APPOINTMENTS } = useLiveData();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return APPOINTMENTS.filter((a) => {
      const matchQuery = a.customerName.toLowerCase().includes(query.toLowerCase()) || a.reference.toLowerCase().includes(query.toLowerCase());
      const matchStatus = statusFilter === "Todos" || a.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [query, statusFilter, APPOINTMENTS]);

  return (
    <CrmShell>
      <Breadcrumbs items={["Principal", "Reservas"]} />
      <PageHeader title="Reservas" description="Listado completo de reservas del salón." />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input placeholder="Buscar por clienta o referencia..." value={query} onChange={(e) => setQuery(e.target.value)} className="sm:w-72" />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-52">
          <option>Todos</option>
          {["Pendiente", "Confirmada", "En curso", "Completada", "Cancelada", "No show"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Referencia</th>
              <th className="px-4 py-3">Clienta</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Especialista</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Pago</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-border-soft hover:bg-blush/10">
                <td className="px-4 py-3 font-medium text-plum">{a.reference}</td>
                <td className="px-4 py-3 text-muted">{a.customerName}</td>
                <td className="px-4 py-3 text-muted">{a.serviceName}</td>
                <td className="px-4 py-3 text-muted">{a.stylistName}</td>
                <td className="px-4 py-3 text-muted">{a.date} {a.time}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(a.paymentStatus)}>{a.paymentStatus}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs font-semibold text-deep-rose hover:underline" onClick={() => setSelected(a)}>
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <AppointmentDrawer appointment={selected} onClose={() => setSelected(null)} onComplete={(id) => { setSelected(null); setCompleting(id); }} />
      <CompletionDrawer appointmentId={completing} onClose={() => setCompleting(null)} />
    </CrmShell>
  );
}

function AppointmentDrawer({ appointment, onClose, onComplete }: { appointment: Appointment | null; onClose: () => void; onComplete: (id: string) => void }) {
  return (
    <Drawer open={!!appointment} onClose={onClose} title="Detalle de la reserva">
      {appointment && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl text-plum">{appointment.reference}</p>
            <Badge tone={statusTone(appointment.status)}>{appointment.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Field label="Clienta" value={appointment.customerName} />
            <Field label="Especialista" value={appointment.stylistName} />
            <Field label="Servicio" value={appointment.serviceName} />
            <Field label="Fecha" value={`${appointment.date} · ${appointment.time}`} />
            <Field label="Duración" value={`${appointment.duration} min`} />
            <Field label="Precio" value={formatUYU(appointment.price)} />
            <Field label="Pagado" value="No disponible" />
            <Field label="Saldo" value="No disponible" />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-border-soft pt-4">
            <Button disabled title="Operación pendiente de implementación segura" size="sm" variant="outline">Reprogramar</Button>
            <Button size="sm" variant="outline">Check-in</Button>
            <Button size="sm" variant="outline">Marcar no show</Button>
            <Button size="sm" variant="destructive">Cancelar</Button>
            {appointment.status !== "Completada" && (
              <Button size="sm" onClick={() => onComplete(appointment.id)}>
                Ver materiales
              </Button>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-muted">{label}</p>
      <p className="font-semibold text-plum">{value}</p>
    </div>
  );
}
