"use client";
import { useAuth } from "@/features/auth/AuthProvider";
import { salonDate } from "@/lib/record-mapping";
import { useLiveData } from "@/features/data/LiveData";
import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CrmShell from "./CrmShell";
import { PageHeader, Breadcrumbs } from "../../components/layout/PortalShell";
import { KpiCard, Card, Badge, statusTone, Select } from "../../components/ui";
import { formatUYU } from "../../data/source";

const revenueData: {month:string;ingresos:number;gastos:number}[] = [];


const COLORS = ["#D46896", "#E8A0BF", "#9D4168", "#F9DCE8"];



export default function CrmDashboard() {
 const {me}=useAuth();
  const { APPOINTMENTS, REVIEWS, PRODUCTS, CONVERSATIONS } = useLiveData();

  const serviceMix = Object.values(APPOINTMENTS.filter(a=>!a.fixture && a.status==="Completada").reduce<Record<string,{name:string;value:number}>>((out,a)=>{out[a.serviceId]??={name:a.serviceName,value:0};out[a.serviceId].value++;return out;},{}));
 const bookingTrend=Object.values(APPOINTMENTS.filter(a=>!a.fixture).reduce<Record<string,{day:string;reservas:number}>>((out,a)=>{out[a.date]??={day:a.date,reservas:0};out[a.date].reservas++;return out;},{}));
  const [range, setRange] = useState("30 días");
  const lowStock = PRODUCTS.filter((p) => !p.fixture && p.stock < p.minStock);
  const unreadMessages = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);
  const todayAppointments = APPOINTMENTS.filter((a) => !a.fixture && a.date === salonDate(new Date().toISOString()));

  return (
    <CrmShell>
      <Breadcrumbs items={["Principal", "Dashboard"]} />
      <PageHeader
        title="Dashboard ejecutivo"
        description="Resumen de los registros cargados en esta página; excluye muestras. Los totales globales requieren informes contables."
        actions={
          <Select disabled title="Resumen de la página cargada" value={range} onChange={(e) => setRange(e.target.value)} className="w-40">
            <option>7 días</option>
            <option>30 días</option>
            <option>Este mes</option>
            <option>Trimestre</option>
          </Select>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Ingresos del mes" value="No disponible" />
        <KpiCard label="Gastos del mes" value="No disponible" />
        <KpiCard label="Ganancia estimada" value="No disponible" />
        <KpiCard label="Reservas de hoy" value={String(todayAppointments.length)} />
        <KpiCard label="Clientes activos" value="No disponible" />
        <KpiCard label="Saldo pendiente" value="No disponible" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <p className="mb-4 font-display text-lg text-plum">Ingresos vs gastos</p><p className="text-sm text-muted">Serie contable no disponible.</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="ingresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D46896" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D46896" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EADDE3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#8F858B" />
              <YAxis tick={{ fontSize: 12 }} stroke="#8F858B" tickFormatter={(v) => `${v / 1000}k`} />
              <RTooltip formatter={(v: any) => formatUYU(Number(v))} />
              <Area type="monotone" dataKey="ingresos" stroke="#D46896" fill="url(#ingresos)" strokeWidth={2} />
              <Line type="monotone" dataKey="gastos" stroke="#291821" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p className="mb-4 font-display text-lg text-plum">Servicios más populares</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={serviceMix} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {serviceMix.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
            {serviceMix.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} /> {s.name}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <p className="mb-4 font-display text-lg text-plum">Reservas por día</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bookingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EADDE3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#8F858B" />
              <YAxis tick={{ fontSize: 12 }} stroke="#8F858B" />
              <RTooltip />
              <Bar dataKey="reservas" fill="#E8A0BF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <p className="mb-4 font-display text-lg text-plum">Citas de hoy</p>
          <div className="space-y-2">
            {todayAppointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border-soft px-4 py-2.5 text-sm">
                <div>
                  <span className="font-semibold text-plum">{a.time}</span> · {a.serviceName} — {a.customerName}
                </div>
                <Badge tone={statusTone(a.status)}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <p className="mb-3 font-display text-lg text-plum">Mensajes nuevos</p>
          <p className="font-display text-3xl text-deep-rose">{unreadMessages}</p>
          <p className="text-xs text-muted">conversaciones sin leer</p>
        </Card>
        <Card className="p-5">
          <p className="mb-3 font-display text-lg text-plum">Opiniones recientes</p>
          <p className="font-display text-3xl text-deep-rose">{REVIEWS.filter((r) => r.status === "Nueva").length}</p>
          <p className="text-xs text-muted">pendientes de revisión</p>
        </Card>
        <Card className="p-5">
          <p className="mb-3 font-display text-lg text-plum">Stock bajo</p>
          <p className="font-display text-3xl text-deep-rose">{me && ["owner","admin"].includes(me.role)?lowStock.length:"Sin acceso"}</p>
          <p className="text-xs text-muted">productos por debajo del mínimo</p>
        </Card>
      </div>
    </CrmShell>
  );
}
