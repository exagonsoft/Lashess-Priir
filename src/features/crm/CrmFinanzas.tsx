"use client";
import Ledger from "@/features/data/Ledger";
import { useLiveData } from "@/features/data/LiveData";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import CrmShell from "./CrmShell";
import { PageHeader, Breadcrumbs } from "../../components/layout/PortalShell";
import { Button, Badge, statusTone, Card, KpiCard, Input, Select, Textarea, Modal, Switch } from "../../components/ui";
import { formatUYU } from "../../data/source";

/* ---------------------------- INGRESOS ---------------------------- */
export function CrmIngresos() {return <CrmShell><PageHeader title="Ingresos" description="Registros financieros del salón."/><Ledger kind="PAYMENTS"/></CrmShell>;}

/* ---------------------------- GASTOS ---------------------------- */
export function CrmGastos() {
  const { EXPENSES } = useLiveData();

  const [showNew, setShowNew] = useState(false);
  const total = EXPENSES.filter(e=>!e.fixture && !e.linkedPurchaseId).reduce((sum, e) => sum + e.amount, 0);
  const paid = EXPENSES.filter((e) => !e.fixture && !e.linkedPurchaseId && e.status === "Pagado").reduce((sum, e) => sum + e.amount, 0);
  const pending = total - paid;
  const recurring = EXPENSES.filter((e) => !e.fixture && !e.linkedPurchaseId && e.recurring).reduce((sum, e) => sum + e.amount, 0);

  const byCategory = Object.values(
    EXPENSES.reduce<Record<string, { name: string; value: number }>>((acc, e) => {
      acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
      acc[e.category].value += e.amount;
      return acc;
    }, {})
  );
  const COLORS = ["#D46896", "#E8A0BF", "#9D4168", "#F9DCE8", "#8F858B", "#291821", "#C9839F", "#B9627F"];

  return (
    <CrmShell>
      <Breadcrumbs items={["Finanzas", "Gastos"]} />
      <PageHeader title="Gastos" description="Gastos operativos de esta página; excluye muestras y compras vinculadas de los totales." actions={<Button disabled title="Operación pendiente de implementación segura" onClick={() => setShowNew(true)}>+ Nuevo gasto</Button>} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Total gastos" value={formatUYU(total)} />
        <KpiCard label="Pagados" value={formatUYU(paid)} />
        <KpiCard label="Pendientes" value={formatUYU(pending)} deltaTone="danger" />
        <KpiCard label="Recurrentes" value={formatUYU(recurring)} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <p className="mb-4 font-display text-lg text-plum">Distribución por categoría</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip formatter={(v: any) => formatUYU(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="overflow-x-auto p-0 lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {EXPENSES.map((e) => (
                <tr key={e.id} className="border-t border-border-soft">
                  <td className="px-4 py-3 font-medium text-plum">
                    {e.description}
                    {e.linkedPurchaseId && <Badge tone="pink" className="ml-2">Compra vinculada</Badge>}
                  </td>
                  <td className="px-4 py-3 text-muted">{e.category}</td>
                  <td className="px-4 py-3 text-muted">{formatUYU(e.amount)}</td>
                  <td className="px-4 py-3 text-muted">{e.date}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(e.status)}>{e.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Nuevo gasto" footer={<><Button variant="ghost" onClick={() => setShowNew(false)}>Cancelar</Button><Button disabled title="Operación pendiente de implementación segura" onClick={() => setShowNew(false)}>Guardar gasto</Button></>}>
        <div className="space-y-4">
          <Input placeholder="Descripción" />
          <div className="grid grid-cols-2 gap-3">
            <Select defaultValue="Alquiler">
              {["Alquiler", "Electricidad", "Agua", "Internet", "Salarios", "Comisiones", "Transporte", "Marketing", "Equipamiento", "Limpieza", "Software", "Mantenimiento", "Impuestos", "Otro"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
            <Input type="number" placeholder="Monto" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" />
            <Select defaultValue="Transferencia">
              <option>Efectivo</option>
              <option>Tarjeta</option>
              <option>Transferencia</option>
            </Select>
          </div>
          <Input placeholder="Proveedor / destinatario" />
          <Switch checked={false} onChange={() => {}} label="Gasto recurrente" />
          <Textarea placeholder="Notas (opcional)" rows={2} />
        </div>
      </Modal>
    </CrmShell>
  );
}

/* ---------------------------- PAGOS ---------------------------- */
export function CrmPagos() {return <CrmShell><PageHeader title="Pagos" description="Registros financieros del salón."/><Ledger kind="PAYMENTS"/></CrmShell>;}

/* ---------------------------- COMISIONES ---------------------------- */
export function CrmComisiones() {return <CrmShell><PageHeader title="Comisiones" description="Registros financieros del salón."/><Ledger kind="COMMISSIONS"/></CrmShell>;}

/* ---------------------------- REPORTES ---------------------------- */
export function CrmReportes() {
  const serviceProfitability: {name:string;revenue:number;materials:number;commission:number;margin:number}[] = [];
  return (
    <CrmShell>
      <Breadcrumbs items={["Finanzas", "Reportes"]} />
      <PageHeader title="Reportes financieros" description="Rentabilidad no disponible hasta completar el registro contable de consumos y comisiones." actions={<Button disabled title="Operación pendiente de implementación segura" variant="outline">Exportar reporte</Button>} />
      <Card className="p-5">
        <p className="mb-4 font-display text-lg text-plum">Rentabilidad por servicio</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={serviceProfitability}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EADDE3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#8F858B" />
            <YAxis tick={{ fontSize: 12 }} stroke="#8F858B" />
            <RTooltip formatter={(v: any) => formatUYU(Number(v))} />
            <Bar dataKey="materials" stackId="a" fill="#F9DCE8" name="Materiales" />
            <Bar dataKey="commission" stackId="a" fill="#E8A0BF" name="Comisión" />
            <Bar dataKey="margin" stackId="a" fill="#9D4168" name="Margen estimado" />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-3 text-xs text-muted">
          Margen de contribución = Ingreso del servicio − Materiales consumidos − Comisión de especialista. No representa la ganancia neta final (no incluye gastos operativos generales).
        </p>
      </Card>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-3 font-display text-lg text-plum">Consumo de inventario (mes)</p>
          <div className="space-y-2 text-sm">
            {[
              { name: "Clusters Volumen Ruso", expected: 48, actual: 52 },
              { name: "Adhesivo Profesional", expected: 3.2, actual: 3.5 },
              { name: "Kit Lifting", expected: 18, actual: 17 },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between rounded-lg border border-border-soft px-3 py-2">
                <span>{p.name}</span>
                <span className="text-muted">
                  Esperado {p.expected} · Real <span className={p.actual > p.expected ? "font-semibold text-red-600" : "font-semibold text-emerald-600"}>{p.actual}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <p className="mb-3 font-display text-lg text-plum">Valor lifetime de clientas (CLV)</p>
          <div className="space-y-2 text-sm">
            {[
              { name: "Martina Pereyra", clv: 48600 },
              { name: "Lucía Fernández", clv: 32400 },
              { name: "Agustina López", clv: 14200 },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-lg border border-border-soft px-3 py-2">
                <span>{c.name}</span>
                <span className="font-semibold text-plum">{formatUYU(c.clv)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </CrmShell>
  );
}
