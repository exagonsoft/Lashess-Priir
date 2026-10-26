"use client";
import { useLiveData } from "@/features/data/LiveData";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "@/lib/navigation";
import { formatUYU, ServiceCategory } from "../../data/source";
import { Button, Badge, SectionLabel, StarRating, EmptyState } from "../../components/ui";
import { IMAGES } from "../../data/images";

const CATEGORIES: (ServiceCategory | "Todos")[] = [
  "Todos",
  "Extensiones de pestañas",
  "Lifting y tratamientos",
  "Cejas",
  "Servicios complementarios",
];

export function ServicesPage() {
  const { SERVICES } = useLiveData();

  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchCategory = category === "Todos" || s.category === category;
      const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [category, query, SERVICES]);

  return (
    <div>
      <section className="bg-plum py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionLabel light>Catálogo completo</SectionLabel>
          <h1 className="font-display text-5xl">Nuestros servicios</h1>
          <p className="mt-4 max-w-xl text-blush/80">
            Tratamientos especializados en pestañas y cejas, diseñados para realzar tu belleza natural con la
            máxima precisión profesional.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  category === c ? "border-fashion bg-fashion text-white" : "border-border-soft text-plum hover:border-fashion"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tratamiento..."
            className="w-full rounded-full border border-border-soft px-4 py-2.5 text-sm focus:border-fashion focus:outline-none sm:w-64"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No encontramos tratamientos" description="Probá con otra categoría o palabra clave." />
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <div key={s.id} className="group overflow-hidden rounded-xl border border-border-soft bg-white shadow-sm transition-shadow hover:shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <img src={s.image} alt={s.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <Badge tone="pink" className="absolute left-3 top-3">
                    {s.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg text-plum">{s.name}</h3>
                    <div className="flex shrink-0 items-center gap-1 text-xs text-muted">
                      <StarRating value={s.rating} readOnly size={12} /> {s.rating}
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{s.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                    <span>⏱ {s.duration} min</span>
                    <span>💰 Seña {formatUYU(s.deposit || 0)}</span>
                    <span>👥 {s.stylistIds.length} especialistas</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-4">
                    <span className="font-display text-xl text-deep-rose">{formatUYU(s.price)}</span>
                    <div className="flex gap-2">
                      <Link to={`/servicios/${s.slug}`}>
                        <Button size="sm" variant="outline">
                          Ver detalle
                        </Button>
                      </Link>
                      <Button size="sm" onClick={() => navigate(`/reservar?servicio=${s.id}`)}>
                        Reservar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function ServiceDetailPage() {
  const { SERVICES, STYLISTS, REVIEWS } = useLiveData();

  const { slug } = useParams();
  const navigate = useNavigate();
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return <div className="p-10 text-center text-plum">Este perfil no está disponible. <Link to="/">Volver al inicio</Link></div>;
  const stylists = STYLISTS.filter((s) => service.stylistIds.includes(s.id));
  const reviews = REVIEWS.filter((r) => r.serviceName === service.name);
  const related = SERVICES.filter((s) => s.category === service.category && s.id !== service.id).slice(0, 3);


  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={service.image} alt={service.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-plum/90 via-plum/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 text-white lg:p-14">
          <div className="mx-auto max-w-7xl">
            <Badge tone="pink">{service.category}</Badge>
            <h1 className="mt-4 font-display text-4xl lg:text-6xl">{service.name}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <StarRating value={service.rating} readOnly />
              <span>
                {service.rating} ({service.reviewCount} opiniones)
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl grid grid-cols-1 gap-12 px-5 py-14 lg:grid-cols-3 lg:px-10">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl text-plum">Descripción</h2>
          <p className="mt-3 leading-relaxed text-plum/75">{service.longDescription}</p>

          <h3 className="mt-8 font-display text-xl text-plum">Beneficios</h3>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {service.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-plum/80">
                <span className="text-fashion">✦</span> {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-blush/30 p-5">
              <h4 className="font-display text-lg text-plum">Antes de tu cita</h4>
              <ul className="mt-2 space-y-1.5 text-sm text-plum/75">
                {service.prep.length ? service.prep.map((p) => <li key={p}>— {p}</li>) : <li>Sin preparación especial.</li>}
              </ul>
            </div>
            <div className="rounded-xl bg-blush/30 p-5">
              <h4 className="font-display text-lg text-plum">Cuidados posteriores</h4>
              <ul className="mt-2 space-y-1.5 text-sm text-plum/75">
                {service.aftercare.map((p) => (
                  <li key={p}>— {p}</li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="mt-10 font-display text-xl text-plum">Especialistas disponibles</h3>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stylists.map((st) => (
              <Link to={`/especialistas/${st.slug}`} key={st.id} className="group text-center">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full">
                  <img src={st.image} alt={st.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <p className="mt-2 font-semibold text-plum">{st.name}</p>
                <p className="text-xs text-muted">{st.specialty}</p>
              </Link>
            ))}
          </div>

          {reviews.length > 0 && (
            <>
              <h3 className="mt-10 font-display text-xl text-plum">Opiniones verificadas</h3>
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border-soft p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-plum">{r.customerName}</p>
                      <StarRating value={r.rating} readOnly size={14} />
                    </div>
                    <p className="mt-2 text-sm text-plum/75">{r.comment}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {related.length > 0 && (
            <>
              <h3 className="mt-10 font-display text-xl text-plum">Servicios relacionados</h3>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} to={`/servicios/${r.slug}`} className="group overflow-hidden rounded-xl border border-border-soft">
                    <div className="h-32 overflow-hidden">
                      <img src={r.image} alt={r.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-plum">{r.name}</p>
                      <p className="text-xs text-muted">{formatUYU(r.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <div className="sticky top-28 rounded-2xl border border-border-soft bg-white p-6 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Precio del servicio</p>
            <p className="mt-1 font-display text-4xl text-deep-rose">{formatUYU(service.price)}</p>
            <div className="mt-4 space-y-2 text-sm text-plum/75">
              <div className="flex justify-between">
                <span>Duración</span>
                <span className="font-semibold">{service.duration} min</span>
              </div>
              <div className="flex justify-between">
                <span>Seña requerida</span>
                <span className="font-semibold">{service.deposit ? formatUYU(service.deposit) : "No requiere"}</span>
              </div>
              <div className="flex justify-between">
                <span>Saldo restante</span>
                <span className="font-semibold">{formatUYU(service.price - service.deposit)}</span>
              </div>
            </div>
            <Button className="mt-6 w-full" size="lg" onClick={() => navigate(`/reservar?servicio=${service.id}`)}>
              Reservar ahora
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted">
              Podés pagar solo la seña o el total del tratamiento al confirmar tu reserva.
            </p>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl">
            <img src={IMAGES.interiors[1]} alt="Salón" className="h-48 w-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
