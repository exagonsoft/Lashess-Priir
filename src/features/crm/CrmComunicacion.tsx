"use client";
import EditRecord from "@/features/data/EditRecord";
import { api } from "@/lib/api";
import Messenger from "@/features/data/Messenger";
import { useLiveData } from "@/features/data/LiveData";
import { useState } from "react";
import CrmShell from "./CrmShell";
import { PageHeader, Breadcrumbs } from "../../components/layout/PortalShell";
import { Button, Badge, statusTone, Card, Avatar, StarRating, Select, Textarea, KpiCard, Switch } from "../../components/ui";
import { formatUYU } from "../../data/source";
import { cn } from "../../utils/cn";

/* ---------------------------- MENSAJES ---------------------------- */
export function CrmMensajes() {return <CrmShell><PageHeader title="Mensajes" description="Conversaciones de lashess-priir."/><Messenger/></CrmShell>;}

/* ---------------------------- OPINIONES (admin) ---------------------------- */
export function CrmOpiniones() {
  const { REVIEWS } = useLiveData();

  const [tab, setTab] = useState<"Nueva" | "Publicada" | "Reportada">("Nueva");
  const filtered = REVIEWS.filter((r) => r.status === tab);
  const real=REVIEWS.filter(r=>r.verified && !r.fixture);const avg=real.length?(real.reduce((n,r)=>n+r.rating,0)/real.length).toFixed(1):"Sin opiniones";

  return (
    <CrmShell>
      <Breadcrumbs items={["Comunicación", "Opiniones"]} />
      <PageHeader title="Gestión de opiniones" description="Moderación y respuesta a opiniones de clientas." />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Valoración promedio" value={`${avg} ★`} />
        <KpiCard label="Nuevas" value={String(REVIEWS.filter((r) => r.status === "Nueva").length)} />
        <KpiCard label="Publicadas" value={String(REVIEWS.filter((r) => r.status === "Publicada").length)} />
        <KpiCard label="Reportadas" value={String(REVIEWS.filter((r) => r.status === "Reportada").length)} />
      </div>
      <div className="mt-6 flex gap-2">
        {(["Nueva", "Publicada", "Reportada"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("rounded-full border px-4 py-2 text-xs font-semibold", tab === t ? "border-fashion bg-fashion text-white" : "border-border-soft text-plum")}>
            {t}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {filtered.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar name={r.customerName} size={34} />
                <div>
                  <p className="font-semibold text-plum">{r.customerName}</p>
                  <StarRating value={r.rating} readOnly size={13} />
                </div>
              </div>
              <span className="text-xs text-muted">{r.date}</span>
            </div>
            <p className="mt-3 text-sm text-plum/80">{r.comment}</p><EditRecord key={r.id} collection="reviews" id={r.id} fixture={r.fixture} initial={{response:r.response||"",status:r.status}}/>
            <p className="mt-1 text-xs text-muted">{r.serviceName} con {r.stylistName}</p>
            {r.response ? (
              <div className="mt-3 rounded-lg bg-blush/30 p-3 text-xs text-plum/80">
                <span className="font-semibold text-deep-rose">Respuesta publicada: </span>
                {r.response}
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <input placeholder="Responder públicamente..." className="flex-1 rounded-md border border-border-soft px-3 py-2 text-xs focus:border-fashion focus:outline-none" />
                <Button disabled title="Operación pendiente de implementación segura" size="sm">Responder</Button>
                {tab === "Nueva" && (
                  <Button disabled title="Operación pendiente de implementación segura" size="sm" variant="outline">
                    Publicar
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted">No hay opiniones en esta categoría.</p>}
      </div>
    </CrmShell>
  );
}

/* ---------------------------- MARKETING ---------------------------- */
export function CrmMarketing() {
  const segments = [
    { name: "Clientas VIP", count: 12, desc: "Más de 15 visitas o gasto superior a $25.000" },
    { name: "Nuevas clientas", count: 8, desc: "Primera cita en los últimos 30 días" },
    { name: "Clientas inactivas", count: 14, desc: "Sin visitas en más de 90 días" },
    { name: "Cumpleaños este mes", count: 5, desc: "Clientas con cumpleaños en febrero" },
  ];
  const campaigns = [
    { name: "San Valentín - 15% OFF", status: "Activa", sent: 240, opened: 168 },
    { name: "Reactivación clientas inactivas", status: "Programada", sent: 0, opened: 0 },
    { name: "Bienvenida nuevas clientas", status: "Activa", sent: 42, opened: 35 },
  ];
  return (
    <CrmShell>
      <Breadcrumbs items={["Comunicación", "Marketing"]} />
      <PageHeader title="Marketing y retención" description="Segmentación de clientas y campañas activas." actions={<Button disabled title="Operación pendiente de implementación segura">+ Nueva campaña</Button>} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {segments.map((s) => (
          <Card key={s.name} className="p-5">
            <p className="font-display text-2xl text-plum">{s.count}</p>
            <p className="mt-1 text-sm font-semibold text-plum">{s.name}</p>
            <p className="mt-1 text-xs text-muted">{s.desc}</p>
            <Button size="sm" variant="outline" className="mt-3 w-full">
              Ver clientas
            </Button>
          </Card>
        ))}
      </div>
      <h3 className="mb-3 mt-8 font-display text-xl text-plum">Campañas</h3>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Campaña</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Enviados</th>
              <th className="px-4 py-3">Abiertos</th>
              <th className="px-4 py-3">Tasa apertura</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.name} className="border-t border-border-soft">
                <td className="px-4 py-3 font-medium text-plum">{c.name}</td>
                <td className="px-4 py-3">
                  <Badge tone={c.status === "Activa" ? "success" : "info"}>{c.status}</Badge>
                </td>
                <td className="px-4 py-3 text-muted">{c.sent}</td>
                <td className="px-4 py-3 text-muted">{c.opened}</td>
                <td className="px-4 py-3 text-muted">{c.sent ? `${Math.round((c.opened / c.sent) * 100)}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <h3 className="mb-3 mt-8 font-display text-xl text-plum">Códigos de descuento</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { code: "SANVALENTIN15", value: "15% OFF", uses: "48/100" },
          { code: "BIENVENIDA10", value: "10% OFF primera cita", uses: "22/∞" },
        ].map((d) => (
          <Card key={d.code} className="p-5">
            <p className="font-display text-lg text-plum">{d.code}</p>
            <p className="text-sm text-deep-rose">{d.value}</p>
            <p className="mt-1 text-xs text-muted">Usos: {d.uses}</p>
          </Card>
        ))}
      </div>
    </CrmShell>
  );
}

/* ---------------------------- NOTIFICACIONES ---------------------------- */
export function CrmNotificaciones() {
  const { NOTIFICATIONS, reload } = useLiveData();
 const [error,setError]=useState("");
 async function mark(ids:string[]){try{await Promise.all(ids.map(id=>api("/notifications/"+id,{method:"PATCH",body:JSON.stringify({read:true})})));reload();}catch{setError("No se pudo guardar el estado de lectura. Reintentá.");}}

  const items = NOTIFICATIONS;
  return (
    <CrmShell>
      <Breadcrumbs items={["Comunicación", "Notificaciones"]} />
      <PageHeader
        title="Notificaciones"
        description={error || "Centro de notificaciones del sistema."}
        actions={
          <Button variant="outline" onClick={() => void mark(items.filter(n=>!n.read&&!n.fixture).map(n=>n.id))}>
            Marcar todas como leídas
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((n) => (
            <Card key={n.id} className={cn("flex items-start justify-between gap-3 p-4", !n.read && "border-fashion/40 bg-blush/20")}>
              <div>
                <p className="font-semibold text-plum">{n.title}</p>
                <p className="mt-0.5 text-sm text-muted">{n.description}</p>
                <p className="mt-1 text-[11px] text-muted/70">{n.time}</p>
              </div>
              {!n.read && (
                <button onClick={() => void mark([n.id])} className="text-xs font-semibold text-deep-rose hover:underline">
                  Marcar leído
                </button>
              )}
            </Card>
          ))}
        </div>
        <Card className="p-5">
          <p className="mb-3 font-display text-lg text-plum">Preferencias</p>
          <div className="space-y-3 text-sm">
            {["Nueva reserva", "Pago recibido", "Nueva opinión", "Stock bajo", "Nuevo mensaje"].map((p) => (
              <div key={p} className="flex items-center justify-between">
                <span className="text-plum/80">{p}</span>
                <span className="text-xs text-muted">Configuración pendiente</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </CrmShell>
  );
}
