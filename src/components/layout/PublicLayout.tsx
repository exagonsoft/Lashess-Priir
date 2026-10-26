"use client";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "@/lib/navigation";
import { cn } from "../../utils/cn";
import { Button } from "../ui";
import ChatWidget from "../ChatWidget";
import Image from "next/image";

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/especialistas", label: "Especialistas" },
  { to: "/galeria", label: "Galería" },
  { to: "/opiniones", label: "Opiniones" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Image
        src="/icons/icon-512.png"
        alt="Lashess Priir"
        width={36}
        height={36}
      />
      <Image
        src="/images/logo.png"
        alt="Lashess Priir"
        width={120}
        height={36}
      />
    </Link>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-soft-white">
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/95 shadow-sm backdrop-blur" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "text-xs font-semibold uppercase tracking-widest text-plum/80 transition-colors hover:text-fashion",
                    isActive && "text-fashion",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="text-xs font-semibold uppercase tracking-widest text-plum/80 hover:text-fashion"
            >
              Iniciar sesión
            </Link>
            <Link to="/reservar">
              <Button size="md">Reservar cita</Button>
            </Link>
          </div>
          <button
            aria-label="Abrir menú"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-plum/20 lg:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-border-soft bg-white px-5 py-5 lg:hidden">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="text-sm font-semibold uppercase tracking-wide text-plum"
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-2 flex flex-col gap-3 border-t border-border-soft pt-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold uppercase tracking-wide text-plum"
                >
                  Iniciar sesión
                </Link>
                <Link to="/reservar">
                  <Button className="w-full">Reservar cita</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      <main>{children}</main>
      <PublicFooter />
      <ChatWidget />
    </div>
  );
}

function PublicFooter() {
  const navigate = useNavigate();
  return (
    <footer className="bg-plum text-blush">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-blush/70">
              Estudio de belleza especializado en miradas, cejas y tratamientos
              de autor. Elegancia, precisión y una experiencia pensada para ti.
            </p>
            <div className="mt-5 flex gap-3">
              {["IG", "FB", "TT"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-blush/30 text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-rose">
              Navegación
            </p>
            <ul className="space-y-2 text-sm text-blush/80">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-rose">
              Contacto
            </p>
            <ul className="space-y-2 text-sm text-blush/80">
              <li>Av. 18 de Julio 1234, Montevideo</li>
              <li>+598 99 111 222</li>
              <li>Consultas por teléfono o WhatsApp</li>
              <li>Lun a Sáb · 9:00 - 19:00</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-rose">
              Acceso
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/reservar")}
                className="text-left text-sm font-semibold text-white hover:text-rose"
              >
                Reservar cita →
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-left text-sm text-blush/80 hover:text-white"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate("/staff")}
                className="text-left text-sm text-blush/80 hover:text-white"
              >
                Portal especialistas
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="text-left text-sm text-blush/80 hover:text-white"
              >
                Panel administración
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blush/15 pt-6 text-xs text-blush/60 sm:flex-row">
          <p>© 2026 lashess-priir. Todos los derechos reservados.</p>
          <div className="flex gap-5">
            <span>Política de privacidad</span>
            <span>Términos de uso</span>
            <span>Política de cancelación</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
