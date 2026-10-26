"use client";
import { useLiveData } from "@/features/data/LiveData";
import { useState } from "react";
import CrmShell from "./CrmShell";
import { PageHeader, Breadcrumbs } from "../../components/layout/PortalShell";
import { Button, Badge, Card, Tabs, Input, Select, Textarea, Switch, Avatar } from "../../components/ui";
import { IMAGES } from "../../data/images";


/* ---------------------------- CONTENIDO WEB ---------------------------- */
export function CrmContenidoWeb() {
  const { STYLISTS } = useLiveData();

  const [tab, setTab] = useState("Inicio");
  return (
    <CrmShell>
      <Breadcrumbs items={["Administración", "Contenido web"]} />
      <PageHeader title="Contenido del sitio web" description="Editá el contenido público del sitio sin tocar código." actions={<Button variant="outline">Vista previa</Button>} />
      <Tabs tabs={["Inicio", "Especialistas", "Galería", "Testimonios", "Contacto"]} active={tab} onChange={setTab} />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {tab === "Inicio" && (
          <>
            <Card className="p-6">
              <p className="mb-3 font-display text-lg text-plum">Hero principal</p>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted">Título</label>
              <Input defaultValue="TU MIRADA. TU ESTILO." className="mb-3" />
              <label className="mb-1 block text-xs font-semibold uppercase text-muted">Subtítulo</label>
              <Textarea rows={3} defaultValue="Realza tu belleza natural con tratamientos personalizados, profesionales especializados y una experiencia creada para ti." />
              <label className="mb-1 mt-3 block text-xs font-semibold uppercase text-muted">CTA principal</label>
              <Input defaultValue="RESERVAR AHORA" />
              <Button disabled title="Operación pendiente de implementación segura" className="mt-4">Guardar cambios</Button>
            </Card>
            <Card className="p-6">
              <p className="mb-3 font-display text-lg text-plum">Imagen del hero</p>
              <img src={IMAGES.heroMain} className="h-48 w-full rounded-lg object-cover" alt="Hero" />
              <Button variant="outline" className="mt-3 w-full">
                Reemplazar imagen
              </Button>
            </Card>
          </>
        )}
        {tab === "Especialistas" && (
          <Card className="p-6 lg:col-span-2">
            <p className="mb-3 font-display text-lg text-plum">Perfiles publicados</p>
            <div className="space-y-3">
              {STYLISTS.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-border-soft p-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={s.image} name={s.name} size={36} />
                    <div>
                      <p className="font-medium text-plum">{s.name}</p>
                      <p className="text-xs text-muted">{s.specialty}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
        {tab === "Galería" && (
          <Card className="p-6 lg:col-span-2">
            <p className="mb-3 font-display text-lg text-plum">Imágenes de galería</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {IMAGES.gallery.map((g, i) => (
                <img key={i} src={g} className="h-20 w-full rounded-md object-cover" alt="Galería" />
              ))}
            </div>
            <Button variant="outline" className="mt-4">
              + Subir imagen
            </Button>
          </Card>
        )}
        {tab === "Testimonios" && (
          <Card className="p-6 lg:col-span-2">
            <p className="text-sm text-muted">Gestioná qué opiniones se destacan en la página principal desde el módulo de Opiniones.</p>
          </Card>
        )}
        {tab === "Contacto" && (
          <Card className="p-6 lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <Input defaultValue="Av. 18 de Julio 1234, Montevideo" placeholder="Dirección" />
              <Input defaultValue="+598 99 111 222" placeholder="Teléfono" />
              <Input defaultValue="" placeholder="Email" />
              <Input defaultValue="Lun-Sáb 9:00-19:00" placeholder="Horario" />
            </div>
            <Button disabled title="Operación pendiente de implementación segura" className="mt-4">Guardar cambios</Button>
          </Card>
        )}
      </div>
    </CrmShell>
  );
}

/* ---------------------------- USUARIOS Y PERMISOS ---------------------------- */
export function CrmUsuarios() {
  const users = [
    { name: "Rocío Benítez", role: "Administradora", email: "rocio@lashess-priir.example", status: "Activo" },
    { name: "Camila Rossi", role: "Especialista", email: "camila@lashess-priir.example", status: "Activo" },
    { name: "Valentina Díaz", role: "Especialista", email: "valentina@lashess-priir.example", status: "Activo" },
    { name: "Sofía Martínez", role: "Especialista", email: "sofia@lashess-priir.example", status: "Activo" },
    { name: "Martina Fernández", role: "Especialista", email: "martina@lashess-priir.example", status: "Inactivo" },
  ];
  return (
    <CrmShell>
      <Breadcrumbs items={["Administración", "Usuarios y permisos"]} />
      <PageHeader title="Usuarios y permisos" description="Gestioná el acceso de tu equipo al sistema." actions={<Button>+ Invitar usuario</Button>} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Permisos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.name} className="border-t border-border-soft">
                <td className="flex items-center gap-2.5 px-4 py-3 font-medium text-plum">
                  <Avatar name={u.name} size={28} /> {u.name}
                </td>
                <td className="px-4 py-3 text-muted">{u.role}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge tone={u.status === "Activo" ? "success" : "neutral"}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs font-semibold text-deep-rose hover:underline">Editar permisos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="mt-6 p-6">
        <p className="mb-3 font-display text-lg text-plum">Permisos por rol</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["Administración", "Especialista", "Recepción"].map((role) => (
            <div key={role} className="rounded-lg border border-border-soft p-4">
              <p className="mb-2 font-semibold text-plum">{role}</p>
              <ul className="space-y-1.5 text-xs text-muted">
                <li>✓ Ver agenda</li>
                <li>{role === "Especialista" ? "✓" : "✓"} Gestionar reservas</li>
                <li>{role === "Especialista" ? "✕" : "✓"} Ver finanzas</li>
                <li>{role === "Administración" ? "✓" : "✕"} Gestionar usuarios</li>
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </CrmShell>
  );
}

/* ---------------------------- CONFIGURACIÓN ---------------------------- */
export function CrmConfiguracion() {
  const [tab, setTab] = useState("Identidad");
  return (
    <CrmShell>
      <Breadcrumbs items={["Administración", "Configuración"]} />
      <PageHeader title="Configuración" description="Preferencias generales del salón." />
      <Tabs tabs={["Identidad", "Reservas y pagos", "Notificaciones", "Idioma y moneda"]} active={tab} onChange={setTab} />
      <div className="mt-6 max-w-2xl space-y-6">
        {tab === "Identidad" && (
          <Card className="p-6 space-y-4">
            <Input defaultValue="lashess-priir" placeholder="Nombre del salón" />
            <Textarea rows={2} defaultValue="Estudio de belleza especializado en pestañas y cejas." placeholder="Descripción corta" />
            <div className="grid grid-cols-2 gap-4">
              <Input defaultValue="+598 99 111 222" placeholder="Teléfono" />
              <Input defaultValue="" placeholder="Email" />
            </div>
            <Button disabled title="Operación pendiente de implementación segura">Guardar</Button>
          </Card>
        )}
        {tab === "Reservas y pagos" && (
          <Card className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-plum">Permitir reserva como invitada</span>
              <Switch checked onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-plum">Permitir pago de seña</span>
              <Switch checked onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-plum">Permitir pago total anticipado</span>
              <Switch checked onChange={() => {}} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted">Política de cancelación (horas de anticipación)</label>
              <Input type="number" defaultValue={24} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted">Tiempo límite de reserva temporal (minutos)</label>
              <Input type="number" defaultValue={15} />
            </div>
            <Button disabled title="Operación pendiente de implementación segura">Guardar</Button>
          </Card>
        )}
        {tab === "Notificaciones" && (
          <Card className="space-y-3 p-6">
            {["Recordatorios de citas", "Confirmaciones de pago", "Alertas de inventario", "Resumen semanal por email"].map((n) => (
              <div key={n} className="flex items-center justify-between">
                <span className="text-sm text-plum">{n}</span>
                <Switch checked onChange={() => {}} />
              </div>
            ))}
          </Card>
        )}
        {tab === "Idioma y moneda" && (
          <Card className="space-y-4 p-6">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted">Idioma</label>
              <Select defaultValue="es">
                <option value="es">Español (Uruguay)</option>
                <option value="en">English (próximamente)</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted">Moneda</label>
              <Select defaultValue="UYU">
                <option value="UYU">Peso uruguayo (UYU)</option>
                <option value="USD">Dólar (próximamente)</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-muted">Zona horaria</label>
              <Select defaultValue="gmt-3">
                <option value="gmt-3">América/Montevideo (GMT-3)</option>
              </Select>
            </div>
            <Button disabled title="Operación pendiente de implementación segura">Guardar</Button>
          </Card>
        )}
      </div>
    </CrmShell>
  );
}
