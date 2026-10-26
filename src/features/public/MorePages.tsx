"use client";
import { useLiveData } from "@/features/data/LiveData";
import { fixturesEnabled } from "@/lib/fixtures";
import { useMemo, useState } from "react";
import { Link } from "@/lib/navigation";
import { IMAGES } from "../../data/images";

import { Button, SectionLabel, StarRating, Badge, Textarea, Select, EmptyState } from "../../components/ui";

/* ---------------------------- GALLERY ---------------------------- */
export function GalleryPage() {
  const [filter, setFilter] = useState("Todos");
  const cats = ["Todos", "Pestañas", "Cejas", "Salón"];
  const images = [
    ...IMAGES.gallery.map((src) => ({ src, cat: "Pestañas" })),
    ...IMAGES.interiors.map((src) => ({ src, cat: "Salón" })),
    { src: IMAGES.categories.cejas, cat: "Cejas" },
    { src: IMAGES.categories.cejasAlt, cat: "Cejas" },
  ];
  const filtered = filter === "Todos" ? images : images.filter((i) => i.cat === filter);

  return (
    <div>
      <section className="bg-plum py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionLabel light>Inspiración</SectionLabel>
          <h1 className="font-display text-5xl">Galería</h1>
          <p className="mt-4 max-w-xl text-blush/80">Una selección editorial de nuestros trabajos y el espacio que te espera.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                filter === c ? "border-fashion bg-fashion text-white" : "border-border-soft text-plum hover:border-fashion"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="columns-2 gap-4 sm:columns-3 [column-fill:_balance]">
          {filtered.map((img, i) => (
            <div key={i} className="mb-4 overflow-hidden rounded-xl break-inside-avoid">
              <img src={img.src} alt="Galería" className="w-full object-cover transition-transform duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------------------- REVIEWS ---------------------------- */
export function ReviewsPage() {
  const { REVIEWS, SERVICES } = useLiveData();

  const [ratingFilter, setRatingFilter] = useState("Todas");
  const [serviceFilter, setServiceFilter] = useState("Todos");
  const [sort, setSort] = useState("Recientes");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ overall: 0, quality: 0, professionalism: 0, experience: 0, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const avg = REVIEWS.length ? (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1) : "Sin opiniones";
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: REVIEWS.filter((r) => r.rating === star).length,
  }));

  const filtered = useMemo(() => {
    let list = REVIEWS.filter((r) => r.status === "Publicada" || r.status === "Nueva");
    if (ratingFilter !== "Todas") list = list.filter((r) => r.rating === Number(ratingFilter));
    if (serviceFilter !== "Todos") list = list.filter((r) => r.serviceName === serviceFilter);
    if (sort === "Recientes") list = [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (sort === "Mejor calificadas") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [ratingFilter, serviceFilter, sort, REVIEWS]);

  return (
    <div>
      <section className="bg-plum py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionLabel light>Confianza real</SectionLabel>
          <h1 className="font-display text-5xl">Opiniones de nuestras clientas</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-border-soft bg-white p-6 text-center">
            <p className="font-display text-6xl text-deep-rose">{avg}</p>
            <StarRating value={Number(avg)} readOnly />
            <p className="mt-2 text-sm text-muted">{REVIEWS.length} opiniones totales</p>
          </div>
          <div className="lg:col-span-2 space-y-2 rounded-2xl border border-border-soft bg-white p-6">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-3 text-sm">
                <span className="w-10 text-muted">{d.star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-blush/40">
                  <div className="h-full rounded-full bg-fashion" style={{ width: `${REVIEWS.length ? (d.count / REVIEWS.length) * 100 : 0}%` }} />
                </div>
                <span className="w-6 text-right text-muted">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="w-40">
              <option value="Todas">Todas las estrellas</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} estrellas
                </option>
              ))}
            </Select>
            <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="w-56">
              <option value="Todos">Todos los servicios</option>
              {SERVICES.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-48">
              <option>Recientes</option>
              <option>Mejor calificadas</option>
            </Select>
          </div>
          <Button disabled title="Publicación de opiniones pendiente de habilitación" onClick={() => setShowForm((v) => !v)}>Dejar una opinión</Button>
        </div>

        {showForm && (
          <div className="mt-6 rounded-2xl border border-border-soft bg-blush/20 p-6">
            {submitted ? (
              <EmptyState title="¡Gracias por tu opinión!" description="Tu reseña fue enviada y será publicada tras la verificación de tu cita completada." icon="✓" />
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!fixturesEnabled) { window.alert("Esta función estará disponible próximamente. No se envió información."); return; }
                  setSubmitted(true);
                }}
                className="space-y-5"
              >
                <p className="text-sm text-plum/70">Solo clientas con una cita completada pueden dejar una opinión verificada.</p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <RatingField label="Calificación general" value={form.overall} onChange={(v) => setForm({ ...form, overall: v })} />
                  <RatingField label="Calidad del servicio" value={form.quality} onChange={(v) => setForm({ ...form, quality: v })} />
                  <RatingField label="Profesionalismo" value={form.professionalism} onChange={(v) => setForm({ ...form, professionalism: v })} />
                </div>
                <RatingField label="Experiencia general" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} />
                <Textarea
                  required
                  placeholder="Contanos cómo fue tu experiencia..."
                  rows={4}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                />
                <Button disabled title="Operación pendiente de implementación segura" type="submit">Enviar opinión</Button>
              </form>
            )}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl border border-border-soft bg-white p-6">
              <div className="flex items-center justify-between">
                <StarRating value={r.rating} readOnly size={15} />
                <span className="text-xs text-muted">{r.date}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-plum/80">“{r.comment}”</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted">
                <span className="font-semibold text-plum">{r.customerName}</span>
                {r.verified && <Badge tone="success">Cita verificada</Badge>}
              </div>
              <div className="mt-1 text-xs text-muted">
                {r.serviceName} con {r.stylistName}
              </div>
              {r.response && (
                <div className="mt-3 rounded-lg bg-blush/30 p-3 text-xs text-plum/80">
                  <span className="font-semibold text-deep-rose">Respuesta del salón: </span>
                  {r.response}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RatingField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-plum/70">{label}</p>
      <StarRating value={value} onChange={onChange} size={22} />
    </div>
  );
}

/* ---------------------------- ABOUT ---------------------------- */
export function AboutPage() {
  const { STYLISTS } = useLiveData();

  return (
    <div>
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <img src={IMAGES.heroSecondary} alt="Nosotros" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-plum/50 flex items-center">
          <div className="mx-auto max-w-7xl px-5 text-white lg:px-10">
            <SectionLabel light>Nuestra esencia</SectionLabel>
            <h1 className="font-display text-5xl">Sobre lashess-priir</h1>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-16 text-center lg:px-10">
        <p className="font-display text-3xl leading-snug text-plum">
          "Creemos que la belleza es una forma de expresión personal, no un estándar a seguir."
        </p>
        <p className="mt-6 leading-relaxed text-plum/70">
          Desde 2018, lashess-priir se dedica a realzar la belleza natural de cada clienta a través de tratamientos
          especializados en pestañas y cejas. Nuestro equipo combina formación internacional, productos de primer
          nivel y un trato cercano para crear una experiencia de belleza verdaderamente personalizada.
        </p>
      </section>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 pb-16 sm:grid-cols-3 lg:px-10">
        {[
          { title: "Precisión profesional", desc: "Formación continua en las técnicas más exigentes del mundo." },
          { title: "Productos premium", desc: "Trabajamos exclusivamente con insumos de grado profesional." },
          { title: "Experiencia personalizada", desc: "Cada tratamiento se adapta a tu rostro, estilo y necesidades." },
        ].map((v) => (
          <div key={v.title} className="rounded-xl bg-blush/30 p-6 text-center">
            <h3 className="font-display text-xl text-plum">{v.title}</h3>
            <p className="mt-2 text-sm text-plum/70">{v.desc}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-10">
        <h3 className="mb-6 text-center font-display text-3xl text-plum">Nuestro equipo</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STYLISTS.map((st) => (
            <Link to={`/especialistas/${st.slug}`} key={st.id} className="text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
                <img src={st.image} className="h-full w-full object-cover" alt={st.name} />
              </div>
              <p className="mt-2 text-sm font-semibold text-plum">{st.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------------------- CONTACT ---------------------------- */
export function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <section className="bg-plum py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionLabel light>Hablemos</SectionLabel>
          <h1 className="font-display text-5xl">Contacto</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-14 lg:grid-cols-2 lg:px-10">
        <div>
          <h3 className="font-display text-2xl text-plum">Información de contacto</h3>
          <ul className="mt-5 space-y-4 text-sm text-plum/80">
            <li>📍 Av. 18 de Julio 1234, Montevideo, Uruguay</li>
            <li>📞 +598 99 111 222</li>
            <li>💬 WhatsApp: +598 99 111 222</li>
            <li>Consultas por teléfono o WhatsApp</li>
            <li>🕒 Lunes a viernes 9:00-19:00 · Sábados 9:00-15:00</li>
          </ul>
          <div className="mt-6 flex gap-3">
            {["Instagram", "Facebook", "TikTok"].map((s) => (
              <span key={s} className="rounded-full border border-border-soft px-4 py-2 text-xs font-semibold text-plum">
                {s}
              </span>
            ))}
          </div>
          <div className="mt-8 h-64 overflow-hidden rounded-xl bg-blush/40">
            <img src={IMAGES.interiors[2]} alt="Mapa del salón" className="h-full w-full object-cover" />
          </div>
          <Link to="/reservar">
            <Button className="mt-6" size="lg">
              Reservar cita
            </Button>
          </Link>
        </div>
        <div className="rounded-2xl border border-border-soft bg-white p-8 shadow-sm">
          <h3 className="font-display text-2xl text-plum">Envianos un mensaje</h3>
          {sent ? (
            <EmptyState title="¡Mensaje enviado!" description="Te responderemos a la brevedad." icon="✉️" />
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                  if (!fixturesEnabled) { window.alert("Esta función estará disponible próximamente. No se envió información."); return; }
                setSent(true);
              }}
            >
              <input required placeholder="Nombre completo" className="w-full rounded-md border border-border-soft px-3.5 py-2.5 text-sm focus:border-fashion focus:outline-none" />
              <input required type="email" placeholder="Email" className="w-full rounded-md border border-border-soft px-3.5 py-2.5 text-sm focus:border-fashion focus:outline-none" />
              <input placeholder="Teléfono" className="w-full rounded-md border border-border-soft px-3.5 py-2.5 text-sm focus:border-fashion focus:outline-none" />
              <Textarea required rows={4} placeholder="¿En qué podemos ayudarte?" />
              <Button type="submit" className="w-full">
                Enviar mensaje
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
