"use client";
import { useLiveData } from "@/features/data/LiveData";
import { Link, useNavigate, useParams } from "@/lib/navigation";

import { Button, SectionLabel, StarRating, Badge } from "../../components/ui";

export function StylistsPage() {
  const { STYLISTS } = useLiveData();

  return (
    <div>
      <section className="bg-plum py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionLabel light>Nuestro equipo</SectionLabel>
          <h1 className="font-display text-5xl">Especialistas</h1>
          <p className="mt-4 max-w-xl text-blush/80">
            Artistas formadas en las técnicas más exigentes, dedicadas a realzar tu belleza natural con precisión y
            calidez.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STYLISTS.map((st) => (
            <Link key={st.id} to={`/especialistas/${st.slug}`} className="group overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm transition-shadow hover:shadow-xl">
              <div className="h-72 overflow-hidden">
                <img src={st.image} alt={st.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-plum">{st.name}</h3>
                <p className="text-xs uppercase tracking-wide text-deep-rose">{st.specialty}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{st.bio}</p>
                <div className="mt-3 flex items-center justify-between">
                  <StarRating value={st.rating} readOnly size={13} />
                  <span className="text-xs text-muted">{st.experienceYears} años exp.</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function StylistDetailPage() {
  const { STYLISTS, SERVICES, REVIEWS } = useLiveData();

  const { slug } = useParams();
  const navigate = useNavigate();
  const stylist = STYLISTS.find((s) => s.slug === slug);
  if (!stylist) return <div className="p-10 text-center text-plum">Este perfil no está disponible. <Link to="/">Volver al inicio</Link></div>;
  const services = SERVICES.filter((s) => stylist.servicesIds.includes(s.id));
  const reviews = REVIEWS.filter((r) => r.stylistName === stylist.name);

  const slots: string[] = [];

  return (
    <div>
      <section className="mx-auto max-w-7xl grid grid-cols-1 gap-10 px-5 py-14 lg:grid-cols-3 lg:px-10">
        <div className="h-[460px] overflow-hidden rounded-2xl lg:col-span-1">
          <img src={stylist.image} alt={stylist.name} className="h-full w-full object-cover" />
        </div>
        <div className="lg:col-span-2">
          <SectionLabel>{stylist.specialty}</SectionLabel>
          <h1 className="font-display text-5xl text-plum">{stylist.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating value={stylist.rating} readOnly />
            <span className="text-sm text-muted">
              {stylist.rating} · {stylist.reviewCount} opiniones verificadas · {stylist.experienceYears} años de experiencia
            </span>
          </div>
          <p className="mt-5 max-w-2xl leading-relaxed text-plum/75">{stylist.longBio}</p>

          <h3 className="mt-8 font-display text-xl text-plum">Servicios que ofrece</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {services.map((s) => (
              <Badge key={s.id} tone="pink">
                {s.name}
              </Badge>
            ))}
          </div>

          <h3 className="mt-8 font-display text-xl text-plum">Disponibilidad: consultar al salón</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/reservar?especialista=${stylist.id}`)}
                className="rounded-full border border-border-soft px-4 py-2 text-xs font-semibold text-plum hover:border-fashion hover:text-fashion"
              >
                {s}
              </button>
            ))}
          </div>

          <Button size="lg" className="mt-8" onClick={() => navigate(`/reservar?especialista=${stylist.id}`)}>
            Reservar con {stylist.name.split(" ")[0]}
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 lg:px-10">
        <h3 className="font-display text-2xl text-plum">Portafolio</h3>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {stylist.portfolio.map((img, i) => (
            <div key={i} className="h-56 overflow-hidden rounded-xl">
              <img src={img} alt="Trabajo" className="h-full w-full object-cover transition-transform hover:scale-110" />
            </div>
          ))}
        </div>

        {reviews.length > 0 && (
          <>
            <h3 className="mt-12 font-display text-2xl text-plum">Opiniones de clientas</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
      </section>
    </div>
  );
}
