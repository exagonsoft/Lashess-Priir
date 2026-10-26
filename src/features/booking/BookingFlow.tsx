"use client";
import { useLiveData } from "@/features/data/LiveData";
import { fixturesEnabled } from "@/lib/fixtures";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "@/lib/navigation";
import { Service, Stylist, formatUYU } from "../../data/source";
import { Button, Input, Textarea, StarRating } from "../../components/ui";
import { cn } from "../../utils/cn";
import Image from "next/image";

const STEPS = [
  "Servicios",
  "Especialista",
  "Fecha y hora",
  "Tus datos",
  "Pago",
  "Confirmación",
];

type PaymentOption = "deposit" | "full";

export default function BookingFlow() {
  const { SERVICES, STYLISTS } = useLiveData();

  const [params] = useSearchParams();
  const preselectedService = params.get("servicio");
  const preselectedStylist = params.get("especialista");

  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    preselectedService ? [preselectedService] : [],
  );
  const [stylistId, setStylistId] = useState<string>(
    preselectedStylist ?? "any",
  );
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [payment, setPayment] = useState<PaymentOption>("deposit");
  const [processing, setProcessing] = useState<
    "idle" | "processing" | "approved" | "rejected"
  >("idle");
  const [reference] = useState(
    () => `RES-${Math.floor(10000 + Math.random() * 89999)}`,
  );

  const services = useMemo(
    () => SERVICES.filter((s) => selectedServices.includes(s.id)),
    [selectedServices, SERVICES],
  );
  const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
  const totalDeposit = services.reduce((sum, s) => sum + s.deposit, 0);
  const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
  const amountDue = payment === "deposit" ? totalDeposit : totalPrice;
  const remaining = totalPrice - amountDue;

  function toggleService(id: string) {
    setSelectedServices((cur) =>
      cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id],
    );
  }

  function canContinue() {
    if (step === 0) return selectedServices.length > 0;
    if (step === 1) return false;
    if (step === 2) return !!date && !!time;
    if (step === 3) return customer.name && customer.email && customer.phone;
    return true;
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, 1));
  }

  return (
    <div className="min-h-screen bg-soft-white pb-28">
      <div className="border-b border-border-soft bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-10">
          <Link to="/" className="font-display text-xl text-plum">
            <Image
              src="/images/logo.png"
              alt="Lashess Priir"
              width={120}
              height={36}
            />
          </Link>
          <p className="text-xs uppercase tracking-wide text-muted">
            Selección de tratamiento
          </p>
        </div>
        {step < 5 && (
          <div className="mx-auto max-w-6xl px-5 pb-4 lg:px-10">
            <div className="flex items-center gap-2">
              {STEPS.slice(0, 5).map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      i <= step
                        ? "bg-fashion text-white"
                        : "bg-blush/50 text-muted",
                    )}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs font-semibold sm:block",
                      i <= step ? "text-plum" : "text-muted",
                    )}
                  >
                    {s}
                  </span>
                  {i < 4 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        i < step ? "bg-fashion" : "bg-blush/50",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 lg:px-10">
        <p
          role="status"
          className="mb-5 rounded border border-border-soft bg-blush/30 p-4 text-plum"
        >
          Podés consultar tratamientos. La reserva en línea aún no está
          habilitada; contactá al salón para coordinar tu cita. No se realizan
          cobros.
        </p>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === 0 && (
              <StepServices
                selected={selectedServices}
                toggle={toggleService}
              />
            )}
            {step === 1 && (
              <StepStylist
                stylistId={stylistId}
                setStylistId={setStylistId}
                services={services}
              />
            )}
            {step === 2 && (
              <StepDateTime
                date={date}
                time={time}
                setDate={setDate}
                setTime={setTime}
              />
            )}
            {step === 3 && (
              <StepCustomer customer={customer} setCustomer={setCustomer} />
            )}
            {step === 4 && (
              <StepPayment
                payment={payment}
                setPayment={setPayment}
                totalPrice={totalPrice}
                totalDeposit={totalDeposit}
                processing={processing}
              />
            )}
            {step === 5 && (
              <StepConfirmation
                reference={reference}
                services={services}
                stylistId={stylistId}
                date={date}
                time={time}
                customer={customer}
                totalPrice={totalPrice}
                amountDue={amountDue}
                remaining={remaining}
                payment={payment}
              />
            )}

            {step < 5 && (
              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  ← Volver
                </Button>
                <Button
                  onClick={goNext}
                  disabled={
                    !canContinue() ||
                    processing === "processing" ||
                    (step === 4 && !fixturesEnabled)
                  }
                  loading={processing === "processing"}
                >
                  {step === 4 ? "Pagar y confirmar reserva" : "Continuar"}
                </Button>
              </div>
            )}
          </div>

          {step < 5 && (
            <div className="lg:col-span-1">
              <div className="sticky top-6 rounded-2xl border border-border-soft bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg text-plum">
                  Resumen de tu reserva
                </h3>
                {services.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">
                    Aún no seleccionaste servicios.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {services.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm">
                        <span className="text-plum/80">{s.name}</span>
                        <span className="font-semibold text-plum">
                          {formatUYU(s.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-sm text-muted">
                  <div className="flex justify-between">
                    <span>Duración total</span>
                    <span>{totalDuration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Especialista</span>
                    <span>
                      {stylistId === "any"
                        ? "Cualquiera disponible"
                        : (STYLISTS.find((s) => s.id === stylistId)?.name ??
                          "—")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha</span>
                    <span>{date ? `${date} ${time ?? ""}` : "—"}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-border-soft pt-4">
                  <span className="font-semibold text-plum">Total</span>
                  <span className="font-display text-xl text-deep-rose">
                    {formatUYU(totalPrice)}
                  </span>
                </div>
                {step === 4 && (
                  <div className="mt-3 space-y-1 rounded-lg bg-blush/30 p-3 text-xs text-plum/80">
                    <div className="flex justify-between">
                      <span>A pagar ahora</span>
                      <span className="font-semibold">
                        {formatUYU(amountDue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saldo restante</span>
                      <span className="font-semibold">
                        {formatUYU(remaining)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Step 1 --------------------------------- */
function StepServices({
  selected,
  toggle,
}: {
  selected: string[];
  toggle: (id: string) => void;
}) {
  const { SERVICES } = useLiveData();

  const [query, setQuery] = useState("");
  const list = SERVICES.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div>
      <h2 className="font-display text-2xl text-plum">
        Elegí tus tratamientos
      </h2>
      <p className="mt-1 text-sm text-muted">
        Podés combinar varios servicios compatibles en la misma cita.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar tratamiento..."
        className="mt-5 w-full rounded-full border border-border-soft px-4 py-2.5 text-sm focus:border-fashion focus:outline-none"
      />
      <div className="mt-5 space-y-3">
        {list.map((s) => (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
              selected.includes(s.id)
                ? "border-fashion bg-blush/30"
                : "border-border-soft hover:border-rose",
            )}
          >
            <img
              src={s.image}
              alt={s.name}
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-plum">{s.name}</p>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    selected.includes(s.id)
                      ? "border-fashion bg-fashion text-white"
                      : "border-border-soft",
                  )}
                >
                  {selected.includes(s.id) && "✓"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {s.category} · {s.duration} min
              </p>
            </div>
            <span className="font-display text-lg text-deep-rose">
              {formatUYU(s.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Step 2 --------------------------------- */
function StepStylist({
  stylistId,
  setStylistId,
  services,
}: {
  stylistId: string;
  setStylistId: (id: string) => void;
  services: Service[];
}) {
  const { STYLISTS } = useLiveData();

  const eligible = STYLISTS.filter(
    (st) =>
      services.length === 0 ||
      services.every((s) => s.stylistIds.includes(st.id)) ||
      services.some((s) => s.stylistIds.includes(st.id)),
  );
  return (
    <div>
      <h2 className="font-display text-2xl text-plum">Elegí tu especialista</h2>
      <p className="mt-1 text-sm text-muted">
        Seleccioná una profesional específica o dejá que te asignemos la mejor
        disponible.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => setStylistId("any")}
          className={cn(
            "flex items-center gap-4 rounded-xl border p-4 text-left",
            stylistId === "any"
              ? "border-fashion bg-blush/30"
              : "border-border-soft hover:border-rose",
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush text-2xl">
            ✦
          </div>
          <div>
            <p className="font-semibold text-plum">
              Cualquier especialista disponible
            </p>
            <p className="text-xs text-muted">
              Te asignamos la mejor opción según horario
            </p>
          </div>
        </button>
        {eligible.map((st: Stylist) => (
          <button
            key={st.id}
            onClick={() => setStylistId(st.id)}
            className={cn(
              "flex items-center gap-4 rounded-xl border p-4 text-left",
              stylistId === st.id
                ? "border-fashion bg-blush/30"
                : "border-border-soft hover:border-rose",
            )}
          >
            <img
              src={st.image}
              alt={st.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-plum">{st.name}</p>
              <p className="text-xs text-muted">{st.specialty}</p>
              <StarRating value={st.rating} readOnly size={12} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Step 3 --------------------------------- */
function StepDateTime({
  date,
  time,
  setDate,
  setTime,
}: {
  date: string | null;
  time: string | null;
  setDate: (d: string) => void;
  setTime: (t: string) => void;
}) {
  const today = new Date(2026, 1, 10);
  const [monthOffset, setMonthOffset] = useState(0);
  const viewDate = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1,
  );
  const monthName = viewDate.toLocaleDateString("es-UY", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const startWeekday = viewDate.getDay();
  const unavailable = [3, 4, 11, 17, 18, 24, 25];
  const times = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:30",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "16:30",
    "17:30",
    "18:00",
  ];
  const bookedTimes = ["10:30", "14:00", "17:30"];

  return (
    <div>
      <h2 className="font-display text-2xl text-plum">Elegí fecha y horario</h2>
      <p className="mt-1 text-sm text-muted">
        Horario local de Montevideo (GMT-3). Duración estimada mostrada en el
        resumen.
      </p>
      <div className="mt-5 rounded-xl border border-border-soft p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
            className="rounded-full p-2 hover:bg-blush/40"
          >
            ←
          </button>
          <p className="font-display text-lg capitalize text-plum">
            {monthName}
          </p>
          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="rounded-full p-2 hover:bg-blush/40"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted">
          {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
          {Array.from({ length: startWeekday }).map((_, i) => (
            <span key={`sp-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const iso = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isPast = monthOffset === 0 && day < today.getDate();
            const isUnavailable = unavailable.includes(day) || isPast;
            const isSelected = date === iso;
            return (
              <button
                key={day}
                disabled={isUnavailable}
                onClick={() => setDate(iso)}
                className={cn(
                  "aspect-square rounded-lg text-sm font-medium transition-colors",
                  isSelected
                    ? "bg-fashion text-white"
                    : isUnavailable
                      ? "cursor-not-allowed bg-gray-50 text-gray-300 line-through"
                      : "bg-blush/20 text-plum hover:bg-blush/60",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-blush/60" /> Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-gray-100" /> No disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-fashion" /> Seleccionado
          </span>
        </div>
      </div>

      {date && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-plum">
            Horarios disponibles para {date}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {times.map((t) => {
              const booked = bookedTimes.includes(t);
              return (
                <button
                  key={t}
                  disabled={booked}
                  onClick={() => setTime(t)}
                  className={cn(
                    "rounded-lg border py-2.5 text-sm font-semibold transition-colors",
                    time === t
                      ? "border-fashion bg-fashion text-white"
                      : booked
                        ? "cursor-not-allowed border-border-soft bg-gray-50 text-gray-300 line-through"
                        : "border-border-soft text-plum hover:border-fashion",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Step 4 --------------------------------- */
function StepCustomer({
  customer,
  setCustomer,
}: {
  customer: { name: string; email: string; phone: string; notes: string };
  setCustomer: (c: any) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl text-plum">Tus datos</h2>
      <p className="mt-1 text-sm text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link
          to="/login"
          className="font-semibold text-deep-rose hover:underline"
        >
          Iniciar sesión
        </Link>{" "}
        o continuá como invitada.
      </p>
      <div className="mt-5 space-y-4">
        <Input
          required
          placeholder="Nombre completo"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        />
        <Input
          required
          type="email"
          placeholder="Email"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        />
        <Input
          required
          placeholder="Teléfono"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        />
        <Textarea
          placeholder="Notas adicionales (opcional)"
          rows={3}
          value={customer.notes}
          onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
        />
      </div>
    </div>
  );
}

/* --------------------------------- Step 5 --------------------------------- */
function StepPayment({
  payment,
  setPayment,
  totalPrice,
  totalDeposit,
  processing,
}: {
  payment: PaymentOption;
  setPayment: (p: PaymentOption) => void;
  totalPrice: number;
  totalDeposit: number;
  processing: "idle" | "processing" | "approved" | "rejected";
}) {
  if (processing === "processing") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border-soft py-24 text-center">
        <svg
          className="h-10 w-10 animate-spin text-fashion"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="mt-4 font-display text-xl text-plum">
          Procesando tu pago...
        </p>
        <p className="mt-1 text-sm text-muted">
          Esto puede tardar unos segundos. No cierres esta ventana.
        </p>
        <p className="mt-6 text-xs text-muted">
          ⏱ Tu horario está reservado temporalmente durante el pago.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-plum">Elegí cómo pagar</h2>
      <p className="mt-1 text-sm text-muted">
        Ambas opciones confirman tu reserva inmediatamente luego del pago.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <button
          onClick={() => setPayment("deposit")}
          className={cn(
            "rounded-xl border-2 p-6 text-left transition-colors",
            payment === "deposit"
              ? "border-fashion bg-blush/30"
              : "border-border-soft hover:border-rose",
          )}
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-lg text-plum">Pagar seña</p>
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2",
                payment === "deposit"
                  ? "border-fashion bg-fashion text-white"
                  : "border-border-soft",
              )}
            >
              {payment === "deposit" && "✓"}
            </span>
          </div>
          <p className="mt-3 font-display text-3xl text-deep-rose">
            {formatUYU(totalDeposit)}
          </p>
          <p className="text-xs text-muted">
            Saldo restante: {formatUYU(totalPrice - totalDeposit)}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-plum/70">
            Confirma tu reserva pagando la seña. El saldo restante se abona en
            el salón.
          </p>
        </button>
        <button
          onClick={() => setPayment("full")}
          className={cn(
            "rounded-xl border-2 p-6 text-left transition-colors",
            payment === "full"
              ? "border-fashion bg-blush/30"
              : "border-border-soft hover:border-rose",
          )}
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-lg text-plum">Pagar el total</p>
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border-2",
                payment === "full"
                  ? "border-fashion bg-fashion text-white"
                  : "border-border-soft",
              )}
            >
              {payment === "full" && "✓"}
            </span>
          </div>
          <p className="mt-3 font-display text-3xl text-deep-rose">
            {formatUYU(totalPrice)}
          </p>
          <p className="text-xs text-muted">Saldo restante: {formatUYU(0)}</p>
          <p className="mt-3 text-xs leading-relaxed text-plum/70">
            Paga el total ahora y disfruta de tu cita sin pagos pendientes.
          </p>
        </button>
      </div>
      <div className="mt-6 rounded-xl border border-border-soft p-5">
        <p className="text-sm font-semibold text-plum">Método de pago</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["Tarjeta", "Mercado Pago", "Transferencia"].map((m, i) => (
            <button
              key={m}
              className={cn(
                "rounded-lg border py-2.5 text-xs font-semibold",
                i === 0
                  ? "border-fashion bg-blush/20 text-plum"
                  : "border-border-soft text-muted",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Input placeholder="Número de tarjeta" />
          <Input placeholder="Nombre en tarjeta" />
          <Input placeholder="MM/AA" />
          <Input placeholder="CVC" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Step 6 --------------------------------- */
function StepConfirmation({
  reference,
  services,
  stylistId,
  date,
  time,
  customer,
  totalPrice,
  amountDue,
  remaining,
  payment,
}: {
  reference: string;
  services: Service[];
  stylistId: string;
  date: string | null;
  time: string | null;
  customer: { name: string; email: string; phone: string; notes: string };
  totalPrice: number;
  amountDue: number;
  remaining: number;
  payment: PaymentOption;
}) {
  const { STYLISTS } = useLiveData();

  const stylist = STYLISTS.find((s) => s.id === stylistId);
  return (
    <div className="rounded-2xl border border-border-soft bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-600">
        ✓
      </div>
      <h2 className="mt-5 font-display text-2xl text-plum">
        {payment === "deposit"
          ? "RESERVA CONFIRMADA — SEÑA RECIBIDA"
          : "RESERVA CONFIRMADA — PAGO COMPLETO"}
      </h2>
      <p className="mt-2 text-sm text-muted">Referencia de reserva</p>
      <p className="font-display text-xl text-deep-rose">{reference}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 rounded-xl bg-blush/20 p-6 text-left sm:grid-cols-2">
        <Info label="Cliente" value={customer.name || "Invitada"} />
        <Info
          label="Especialista"
          value={stylist ? stylist.name : "Cualquiera disponible"}
        />
        <Info
          label="Servicio(s)"
          value={services.map((s) => s.name).join(", ")}
        />
        <Info label="Fecha y hora" value={`${date ?? "-"} · ${time ?? "-"}`} />
        <Info label="Precio total" value={formatUYU(totalPrice)} />
        <Info label="Monto abonado" value={formatUYU(amountDue)} />
        <Info label="Saldo pendiente" value={formatUYU(remaining)} />
        <Info
          label="Estado del pago"
          value={payment === "deposit" ? "Seña pagada" : "Pagado completo"}
        />
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/cuenta/reservas">
          <Button size="lg">Ver mis reservas</Button>
        </Link>
        <Link to="/">
          <Button size="lg" variant="outline">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-0.5 font-semibold text-plum">{value}</p>
    </div>
  );
}
