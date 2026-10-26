"use client";
import { useLiveData } from "@/features/data/LiveData";
import { Link } from "@/lib/navigation";
import { IMAGES } from "../../data/images";
import { formatUYU } from "../../data/source";
import { Button, SectionLabel, StarRating, Badge } from "../../components/ui";

export default function Home() {
  const { SERVICES, STYLISTS, REVIEWS } = useLiveData();

  const featured = SERVICES.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-plum">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative z-10 flex flex-col justify-center px-6 py-20 sm:px-10 lg:py-0">
            <SectionLabel light>lashess-priir · Beauty Studio</SectionLabel>
            <h1 className="font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              TU MIRADA.
              <br />
              TU ESTILO.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-blush/85">
              Realza tu belleza natural con tratamientos personalizados,
              profesionales especializados y una experiencia creada para ti.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/reservar">
                <Button size="lg">Reservar ahora</Button>
              </Link>
              <Link to="/servicios">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blush text-blush hover:bg-blush hover:text-plum"
                >
                  Explorar servicios
                </Button>
              </Link>
            </div>
            <div className="mt-14 flex gap-10 border-t border-white/10 pt-7">
              <div>
                <p className="font-display text-3xl text-white">+4.8</p>
                <p className="text-xs uppercase tracking-wide text-blush/60">
                  Valoración promedio
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-white">6.200+</p>
                <p className="text-xs uppercase tracking-wide text-blush/60">
                  Citas realizadas
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-white">4</p>
                <p className="text-xs uppercase tracking-wide text-blush/60">
                  Especialistas
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-[420px] lg:h-auto">
            <img
              src={IMAGES.heroMain}
              alt="Editorial de belleza, extensiones de pestañas"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/60 via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Tratamientos de autor</SectionLabel>
            <h2 className="font-display text-4xl text-plum">
              Servicios destacados
            </h2>
          </div>
          <Link
            to="/servicios"
            className="text-sm font-semibold uppercase tracking-wide text-deep-rose hover:text-plum"
          >
            Ver catálogo completo →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => (
            <Link
              key={s.id}
              to={`/servicios/${s.slug}`}
              className="group overflow-hidden rounded-xl border border-border-soft bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <Badge tone="pink" className="absolute left-3 top-3">
                  {s.category}
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-plum">{s.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                  {s.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted">{s.duration} min</span>
                  <span className="font-display text-lg text-deep-rose">
                    {formatUYU(s.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SIGNATURE CAMPAIGN */}
      <section className="bg-blush/40 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:px-10">
          <div className="order-2 lg:order-1">
            <SectionLabel>Tratamiento insignia</SectionLabel>
            <h2 className="font-display text-5xl leading-tight text-plum">
              Volumen Ruso, mirada editorial.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-plum/70">
              Abanicos hechos a mano, ultra livianos, diseñados a medida de cada
              clienta. Una técnica de precisión para una mirada densa, dramática
              y absolutamente natural al tacto.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-plum/80">
              <li>— Duración de 3 a 4 semanas</li>
              <li>— Adhesivo hipoalergénico de grado profesional</li>
              <li>— Diseño personalizado según forma de ojos</li>
            </ul>
            <Link
              to="/servicios/extensiones-volumen-ruso"
              className="mt-8 inline-block"
            >
              <Button size="lg">Descubrir tratamiento</Button>
            </Link>
          </div>
          <div className="order-1 h-[480px] overflow-hidden rounded-2xl lg:order-2">
            <img
              src={IMAGES.categories.pestanasAlt}
              alt="Volumen ruso"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ARTISTS */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Nuestro equipo</SectionLabel>
            <h2 className="font-display text-4xl text-plum">
              Conoce a nuestras artistas
            </h2>
          </div>
          <Link
            to="/especialistas"
            className="text-sm font-semibold uppercase tracking-wide text-deep-rose hover:text-plum"
          >
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {STYLISTS.map((st) => (
            <Link
              key={st.id}
              to={`/especialistas/${st.slug}`}
              className="group"
            >
              <div className="relative h-80 overflow-hidden rounded-xl">
                <img
                  src={st.image}
                  alt={st.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/90 to-transparent p-4">
                  <p className="font-display text-xl text-white">{st.name}</p>
                  <p className="text-xs uppercase tracking-wide text-blush/80">
                    {st.specialty}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <StarRating value={st.rating} readOnly size={14} />
                <span className="text-xs text-muted">
                  {st.reviewCount} opiniones
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="bg-plum py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionLabel light>Resultados reales</SectionLabel>
          <h2 className="mb-10 font-display text-4xl">Antes &amp; después</h2>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <BeforeAfterCard
                key={i}
                before={IMAGES.gallery[i]}
                after={IMAGES.gallery[i + 3]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Opiniones verificadas</SectionLabel>
            <h2 className="font-display text-4xl text-plum">
              Lo que dicen nuestras clientas
            </h2>
          </div>
          <Link
            to="/opiniones"
            className="text-sm font-semibold uppercase tracking-wide text-deep-rose hover:text-plum"
          >
            Ver todas las opiniones →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border-soft bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <StarRating value={r.rating} readOnly size={15} />
                {r.verified && <Badge tone="success">Verificada</Badge>}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-plum/80">
                “{r.comment}”
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-border-soft pt-4 text-xs text-muted">
                <span className="font-semibold text-plum">
                  {r.customerName}
                </span>
                <span>{r.serviceName}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-blush/30 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:px-10">
          <div className="h-[460px] overflow-hidden rounded-2xl">
            <img
              src={IMAGES.aboutPortrait}
              alt="Nuestro estudio"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <SectionLabel>Nuestra historia</SectionLabel>
            <h2 className="font-display text-4xl leading-tight text-plum">
              Belleza con intención, cuidado con propósito.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-plum/70">
              lashess-priir nació de la idea de que cada tratamiento de belleza
              debería sentirse como una experiencia, no un trámite. Formamos a
              nuestro equipo en las técnicas más exigentes del mundo para
              ofrecerte resultados impecables, en un espacio diseñado para que
              te sientas en casa.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="font-display text-3xl text-deep-rose">8 años</p>
                <p className="text-xs uppercase tracking-wide text-muted">
                  De trayectoria
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-deep-rose">100%</p>
                <p className="text-xs uppercase tracking-wide text-muted">
                  Productos profesionales
                </p>
              </div>
            </div>
            <Link to="/nosotros" className="mt-8 inline-block">
              <Button variant="outline">Conocer más</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-10 rounded-2xl bg-plum p-10 text-white lg:grid-cols-2 lg:p-16">
          <div>
            <SectionLabel light>Visítanos</SectionLabel>
            <h2 className="font-display text-4xl">Te esperamos en el salón</h2>
            <ul className="mt-7 space-y-3 text-sm text-blush/85">
              <li>📍 Av. 18 de Julio 1234, Montevideo</li>
              <li>📞 +598 99 111 222</li>
              <li>🕒 Lunes a sábado · 9:00 a 19:00</li>
              <li>💬 WhatsApp disponible para consultas</li>
            </ul>
            <div className="mt-8 flex gap-4">
              <Link to="/contacto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blush text-blush hover:bg-blush hover:text-plum"
                >
                  Ver ubicación
                </Button>
              </Link>
              <Link to="/reservar">
                <Button size="lg">Reservar cita</Button>
              </Link>
            </div>
          </div>
          <div className="h-64 overflow-hidden rounded-xl lg:h-auto">
            <img
              src={IMAGES.interiors[0]}
              alt="Salón"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function BeforeAfterCard({ before, after }: { before: string; after: string }) {
  return (
    <div className="group relative h-72 overflow-hidden rounded-xl">
      <img
        src={before}
        alt="Antes"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={after}
        alt="Después"
        className="absolute inset-0 h-full w-1/2 object-cover transition-all duration-500 group-hover:w-full"
        style={{ borderRight: "2px solid white" }}
      />
      <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
        Antes
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-fashion px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
        Después
      </span>
    </div>
  );
}
