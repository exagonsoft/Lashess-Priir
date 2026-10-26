"use client";
import EditRecord from "@/features/data/EditRecord";
import { useLiveData } from "@/features/data/LiveData";
import { useMemo, useState } from "react";
import CrmShell from "./CrmShell";
import { PageHeader, Breadcrumbs } from "../../components/layout/PortalShell";
import { Button, Badge, statusTone, Card, Input, Select, Avatar, Drawer, Tabs } from "../../components/ui";
import { formatUYU, Customer } from "../../data/source";

export default function CrmClientes() {
  const { CUSTOMERS } = useLiveData();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    return CUSTOMERS.filter((c) => {
      const matchQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase());
      const matchStatus = status === "Todos" || c.status === status;
      return matchQuery && matchStatus;
    });
  }, [query, status, CUSTOMERS]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  return (
    <CrmShell>
      <Breadcrumbs items={["Principal", "Clientes"]} />
      <PageHeader title="Clientes" description="Base de datos completa de clientas del salón." actions={<Button disabled title="Operación pendiente de implementación segura">+ Nueva clienta</Button>} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input placeholder="Buscar por nombre o email..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="sm:w-72" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="sm:w-48">
          <option>Todos</option>
          <option>VIP</option>
          <option>Activo</option>
          <option>Nuevo</option>
          <option>Inactivo</option>
        </Select>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Clienta</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Última visita</th>
              <th className="px-4 py-3">Visitas</th>
              <th className="px-4 py-3">Gasto total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} className="border-t border-border-soft hover:bg-blush/10">
                <td className="flex items-center gap-2.5 px-4 py-3 font-medium text-plum">
                  <Avatar name={c.name} size={30} /> {c.name}
                </td>
                <td className="px-4 py-3 text-muted">{c.phone}</td>
                <td className="px-4 py-3 text-muted">{c.email}</td>
                <td className="px-4 py-3 text-muted">{c.lastVisit}</td>
                <td className="px-4 py-3 text-muted">—</td>
                <td className="px-4 py-3 text-muted">No disponible</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs font-semibold text-deep-rose hover:underline" onClick={() => setSelected(c)}>
                    Ver ficha
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span>
          Mostrando {paged.length} de {filtered.length} clientas
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </Button>
        </div>
      </div>

      <CustomerDetailDrawer customer={selected} onClose={() => setSelected(null)} />
    </CrmShell>
  );
}

function CustomerDetailDrawer({ customer, onClose }: { customer: (Customer & {uid?:string;fixture?:boolean}) | null; onClose: () => void }) {
  const { APPOINTMENTS, REVIEWS } = useLiveData();

  const [tab, setTab] = useState("Historial");
  if (!customer) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;
  const appointments = APPOINTMENTS.filter((a) => a.customerId === customer.id);
  const reviews = REVIEWS.filter((r) => !!customer.uid && r.customerUid === customer.uid);

  return (
    <Drawer open={!!customer} onClose={onClose} title="Ficha de clienta" width="max-w-2xl"><EditRecord key={customer.id} collection="customers" id={customer.id} fixture={customer.fixture} initial={{name:customer.name,email:customer.email,phone:customer.phone,tags:customer.tags.join(", ")}}/>
      <div className="flex items-center gap-4">
        <Avatar name={customer.name} size={56} />
        <div>
          <p className="font-display text-xl text-plum">{customer.name}</p>
          <p className="text-sm text-muted">{customer.email} · {customer.phone}</p>
          <div className="mt-1 flex gap-1.5">
            <Badge tone={statusTone(customer.status)}>{customer.status}</Badge>
            {customer.tags.map((t) => (
              <Badge key={t} tone="neutral">{t}</Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-blush/20 p-4 text-center text-sm">
        <div>
          <p className="font-display text-xl text-plum">{appointments.filter(a=>!a.fixture && a.status==="Completada").length}</p>
          <p className="text-xs text-muted">Visitas</p>
        </div>
        <div>
          <p className="font-display text-xl text-plum">No disponible</p>
          <p className="text-xs text-muted">Gasto total</p>
        </div>
        <div>
          <p className="font-display text-xl text-plum">{customer.preferredStylist ?? "—"}</p>
          <p className="text-xs text-muted">Especialista preferida</p>
        </div>
      </div>
      <Tabs tabs={["Historial", "Pagos", "Opiniones", "Notas internas"]} active={tab} onChange={setTab} className="mt-6" />
      <div className="mt-4">
        {tab === "Historial" && (
          <div className="space-y-2">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border-soft px-3 py-2 text-sm">
                <span>{a.date} · {a.serviceName}</span>
                <Badge tone={statusTone(a.status)}>{a.status}</Badge>
              </div>
            ))}
            {appointments.length === 0 && <p className="text-sm text-muted">Sin citas registradas.</p>}
          </div>
        )}
        {tab === "Pagos" && (
          <div className="space-y-2">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border-soft px-3 py-2 text-sm">
                <span>{a.date} · {"Sin conciliación"}</span>
                <Badge tone={statusTone(a.paymentStatus)}>{a.paymentStatus}</Badge>
              </div>
            ))}
          </div>
        )}
        {tab === "Opiniones" && (
          <div className="space-y-2">
            {reviews.length ? reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-border-soft px-3 py-2 text-sm">
                <p className="font-semibold text-plum">{r.rating} ★ — {r.serviceName}</p>
                <p className="text-muted">{r.comment}</p>
              </div>
            )) : <p className="text-sm text-muted">Sin opiniones registradas.</p>}
          </div>
        )}
        {tab === "Notas internas" && (
          <textarea rows={5} disabled title="Las notas aún no se guardan" placeholder="Agregar nota interna sobre esta clienta..." className="w-full rounded-md border border-border-soft p-3 text-sm focus:border-fashion focus:outline-none" />
        )}
      </div>
    </Drawer>
  );
}
