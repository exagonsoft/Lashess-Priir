"use client";
import { useAuth } from "@/features/auth/AuthProvider";
import { useNotifications } from "@/features/realtime/hooks";
import { fixturesEnabled } from "@/lib/fixtures";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "@/lib/navigation";
import { cn } from "../../utils/cn";
import { Avatar } from "../ui";


export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}
export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export function Icon({ d }: { d: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const ICONS = {
  dashboard: "M3 12l2-2 4 4 10-10 2 2L9 18l-6-6z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  calendar:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  users:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  scissors:
    "M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12",
  box: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12l8.73-5.04M12 22.08V12",
  truck:
    "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  shopping:
    "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  receipt: "M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 2V2zM8 7h8M8 11h8M8 15h5",
  credit: "M1 4h22v16H1zM1 10h22",
  percent:
    "M19 5L5 19M6.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM17.5 20a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  chart: "M4 19V9M10 19V5M16 19v-8M22 19H2",
  message:
    "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  megaphone: "M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 11-5.8-1.6",
  bell: "M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0",
  layout: "M3 3h18v18H3zM3 9h18M9 21V9",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09c0 .68.39 1.29 1 1.51.59.28 1.3.17 1.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06c-.5.5-.61 1.23-.33 1.82.22.61.83 1 1.51 1H21a2 2 0 010 4h-.09c-.68 0-1.29.39-1.51 1z",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35",
  menu: "M3 6h18M3 12h18M3 18h18",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  home: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5H10v5a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z",
};

export default function PortalShell({
  title,
  groups,
  children,
  roleLabel,
  roleName,
  homeHref = "/",
}: {
  title: string;
  groups: NavGroup[];
  children: React.ReactNode;
  roleLabel: string;
  roleName: string;
  homeHref?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const { me, logout } = useAuth();
  const live = useNotifications();
  const notifications = live.data.map((n) => ({
        id: String(n.id),
        title: String(n.title ?? ""),
        description: String(n.description ?? ""),
        time: "",
        read: n.read === true,
      }));
  const unread = notifications.filter((n) => !n.read).length;
  if (!fixturesEnabled) {
    roleName = me?.profile.displayName || me?.email || "Mi cuenta";
    roleLabel = me?.role || "";
  }

  return (
    <div className="flex min-h-screen bg-soft-white">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border-soft bg-plum text-blush transition-all duration-300",
          collapsed ? "w-[76px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <button
            onClick={() => navigate(homeHref)}
            className="flex items-center gap-2 overflow-hidden"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blush/40 font-display text-base text-white">
              L
            </span>
            {!collapsed && (
              <span className="truncate font-display text-lg text-white">
                {title}
              </span>
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
          {groups.map((group, gi) => (
            <div key={gi} className="mb-5">
              {group.title && !collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blush/40">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to.split("/").length <= 2}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-fashion text-white"
                          : "text-blush/70 hover:bg-white/5 hover:text-white",
                      )
                    }
                  >
                    {item.icon}
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-blush/70 hover:bg-white/5"
          >
            <Icon d={ICONS.menu} />
            {!collapsed && "Colapsar menú"}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:ml-[76px]" : "lg:ml-64",
        )}
      >
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border-soft bg-white/90 px-5 py-3.5 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 hover:bg-blush/40 lg:hidden"
            >
              <Icon d={ICONS.menu} />
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-border-soft bg-white px-3.5 py-2 text-sm text-muted sm:flex">
              <Icon d={ICONS.search} />
              <input
                placeholder="Buscar..."
                className="w-48 bg-transparent outline-none placeholder:text-muted"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden text-xs font-semibold uppercase tracking-wide text-muted hover:text-fashion sm:block"
            >
              Ver sitio público
            </Link>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative rounded-full p-2 text-plum hover:bg-blush/50"
                aria-label="Notificaciones"
              >
                <Icon d={ICONS.bell} />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-fashion text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-xl border border-border-soft bg-white p-3 shadow-xl">
                  <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wide text-muted">
                    Notificaciones
                  </p>
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {live.loading && <p className="text-xs">Cargando…</p>}
                    {live.error && (
                      <p role="alert" className="text-xs">
                        {live.error}
                      </p>
                    )}
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-xs",
                          !n.read ? "bg-blush/40" : "hover:bg-blush/20",
                        )}
                      >
                        <p className="font-semibold text-plum">{n.title}</p>
                        <p className="mt-0.5 text-muted">{n.description}</p>
                        <p className="mt-1 text-[10px] text-muted/70">
                          {n.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2.5 border-l border-border-soft pl-3">
              <button
                aria-label="Cerrar sesión"
                onClick={() =>
                  void logout().catch(() =>
                    window.alert("No se pudo cerrar la sesión. Reintentá."),
                  )
                }
                className="rounded-full p-2 hover:bg-blush/40"
              >
                <Icon d={ICONS.logout} />
              </button>
              <Avatar name={roleName} size={34} />
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-plum leading-tight">
                  {roleName}
                </p>
                <p className="text-[11px] text-muted leading-tight">
                  {roleLabel}
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <div className="mb-4 flex items-center gap-1.5 text-xs text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          <span
            className={i === items.length - 1 ? "font-semibold text-plum" : ""}
          >
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-2xl text-plum sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </div>
  );
}
