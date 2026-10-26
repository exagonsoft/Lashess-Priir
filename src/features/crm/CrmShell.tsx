"use client";
import PortalShell, { NavGroup, Icon, ICONS } from "../../components/layout/PortalShell";

const groups: NavGroup[] = [
  {
    title: "Principal",
    items: [
      { to: "/admin", label: "Dashboard", icon: <Icon d={ICONS.dashboard} /> },
      { to: "/admin/agenda", label: "Agenda", icon: <Icon d={ICONS.calendar} /> },
      { to: "/admin/reservas", label: "Reservas", icon: <Icon d={ICONS.receipt} /> },
      { to: "/admin/clientes", label: "Clientes", icon: <Icon d={ICONS.users} /> },
    ],
  },
  {
    title: "Operaciones",
    items: [
      { to: "/admin/especialistas", label: "Especialistas", icon: <Icon d={ICONS.star} /> },
      { to: "/admin/empleados", label: "Empleados", icon: <Icon d={ICONS.users} /> },
      { to: "/admin/servicios", label: "Servicios", icon: <Icon d={ICONS.scissors} /> },
      { to: "/admin/productos", label: "Productos", icon: <Icon d={ICONS.box} /> },
      { to: "/admin/inventario", label: "Inventario", icon: <Icon d={ICONS.grid} /> },
      { to: "/admin/proveedores", label: "Proveedores", icon: <Icon d={ICONS.truck} /> },
      { to: "/admin/compras", label: "Compras", icon: <Icon d={ICONS.shopping} /> },
    ],
  },
  {
    title: "Finanzas",
    items: [
      { to: "/admin/ingresos", label: "Ingresos", icon: <Icon d={ICONS.dollar} /> },
      { to: "/admin/gastos", label: "Gastos", icon: <Icon d={ICONS.receipt} /> },
      { to: "/admin/pagos", label: "Pagos", icon: <Icon d={ICONS.credit} /> },
      { to: "/admin/comisiones", label: "Comisiones", icon: <Icon d={ICONS.percent} /> },
      { to: "/admin/reportes", label: "Reportes", icon: <Icon d={ICONS.chart} /> },
    ],
  },
  {
    title: "Comunicación",
    items: [
      { to: "/admin/mensajes", label: "Mensajes", icon: <Icon d={ICONS.message} /> },
      { to: "/admin/opiniones", label: "Opiniones", icon: <Icon d={ICONS.star} /> },
      { to: "/admin/marketing", label: "Marketing", icon: <Icon d={ICONS.megaphone} /> },
      { to: "/admin/notificaciones", label: "Notificaciones", icon: <Icon d={ICONS.bell} /> },
    ],
  },
  {
    title: "Administración",
    items: [
      { to: "/admin/contenido-web", label: "Contenido web", icon: <Icon d={ICONS.layout} /> },
      { to: "/admin/usuarios", label: "Usuarios y permisos", icon: <Icon d={ICONS.shield} /> },
      { to: "/admin/configuracion", label: "Configuración", icon: <Icon d={ICONS.settings} /> },
    ],
  },
];

export default function CrmShell({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell title="lashess-priir · Admin" groups={groups} roleLabel="Administradora" roleName="Rocío Benítez">
      {children}
    </PortalShell>
  );
}
