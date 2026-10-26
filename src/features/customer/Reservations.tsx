"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";
import { api } from "@/lib/api";
import { Shell } from "./CustomerPortal";
import { PageHeader } from "@/components/layout/PortalShell";
import { Badge, Button, Card, EmptyState, statusTone } from "@/components/ui";
import type { CustomerAppointmentPage } from "@/types/appointments";
const labels = { pending: "Pendiente", confirmed: "Confirmada", completed: "Completada", cancelled: "Cancelada" };
export default function Reservations() {
 const { me, loading: authLoading, error: authError } = useAuth();
 const [cursor, setCursor] = useState<string | null>(null);
 const [attempt, setAttempt] = useState(0);
 const key = JSON.stringify([me?.uid, me?.salonId, cursor, attempt]);
 const [state, setState] = useState<{ key: string; page: CustomerAppointmentPage | null; error: string | null }>({ key: "", page: null, error: null });
 useEffect(() => {
  if (!me || me.role !== "customer") return;
  const controller = new AbortController();
  api<CustomerAppointmentPage>("/appointments?limit=25" + (cursor ? "&cursor=" + encodeURIComponent(cursor) : ""), { signal: controller.signal })
   .then(page => { if (!controller.signal.aborted) setState({key, page, error: null}); })
   .catch(() => { if (!controller.signal.aborted) setState({key, page: null, error: "No se pudieron cargar tus reservas. Reintentá o iniciá sesión nuevamente."}); });
  return () => controller.abort();
 }, [key, me, cursor]);
 const page = state.key === key ? state.page : null;
 const error = authError || (state.key === key ? state.error : null);
 return <Shell>
  <PageHeader title="Mis reservas" description="Consultá tus citas en lashess-priir." actions={<Link href="/reservar"><Button>Nueva reserva</Button></Link>} />
  <div className="space-y-4" aria-live="polite">
   {error ? <Card className="p-5"><p role="alert">{error}</p><Button className="mt-3" onClick={() => setAttempt(n => n + 1)}>Reintentar</Button><Link className="ml-4 text-deep-rose" href="/login">Iniciar sesión</Link></Card>
    : authLoading || (me && !page) ? <p role="status">Cargando reservas…</p>
    : !me ? <Link href="/login">Iniciá sesión para consultar tus reservas.</Link>
    : page?.items.length === 0 ? <EmptyState title="No hay reservas programadas." /> : null}
   {page?.items.map(a => <Card key={a.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
    <div><p className="font-display text-lg text-plum">Reserva {a.id}</p><p className="text-sm text-muted">{new Intl.DateTimeFormat("es-UY", { dateStyle: "long", timeStyle: "short", timeZone: "America/Montevideo" }).format(new Date(a.startsAt))}</p><Badge className="mt-2" tone={statusTone(labels[a.status])}>{labels[a.status]}</Badge></div>
    <p className="font-display text-lg text-plum">{new Intl.NumberFormat("es-UY", {style:"currency",currency:a.total.currency}).format(a.total.amountMinor / 100)}</p>
   </Card>)}
   {page && <div className="flex gap-3">{cursor && <Button variant="outline" onClick={() => setCursor(null)}>Volver al inicio</Button>}{page.nextCursor && <Button onClick={() => setCursor(page.nextCursor)}>Siguiente página</Button>}</div>}
  </div>
 </Shell>;
}
