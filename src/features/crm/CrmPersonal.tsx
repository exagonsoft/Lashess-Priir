"use client";
import LinkStaff from "@/features/data/LinkStaff";
import { useLiveData } from "@/features/data/LiveData";
import { useState } from "react";
import CrmShell from "./CrmShell";
import { PageHeader, Breadcrumbs } from "../../components/layout/PortalShell";
import { Button, Badge, Card, StarRating, Tabs, Input, Select, Textarea } from "../../components/ui";
import { formatUYU, Service } from "../../data/source";

export function CrmEspecialistas() {
  const { STYLISTS } = useLiveData();

  return (
    <CrmShell>
      <Breadcrumbs items={["Operaciones", "Especialistas"]} />
      <PageHeader title="Especialistas" description="Perfil profesional y desempeño de cada especialista." actions={<Button disabled title="Operación pendiente de implementación segura">+ Agregar especialista</Button>} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STYLISTS.map((st) => (
          <Card key={st.id} className="overflow-hidden">
            <img src={st.image} alt={st.name} className="h-44 w-full object-cover" />
            <div className="p-4">
              <p className="font-display text-lg text-plum">{st.name}</p>
              <p className="text-xs text-deep-rose">{st.specialty}</p>
              <div className="mt-2 flex items-center justify-between">
                <StarRating value={st.rating} readOnly size={13} />
                <span className="text-xs text-muted">{st.reviewCount} reseñas</span>
              </div>
              <div className="mt-3 flex justify-between text-xs text-muted">
                <span>{st.experienceYears} años exp.</span>
                <span>{st.servicesIds.length} servicios</span>
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Ver perfil completo
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </CrmShell>
  );
}

export function CrmEmpleados() {
  const { EMPLOYEES } = useLiveData();

  return (
    <CrmShell>
      <Breadcrumbs items={["Operaciones", "Empleados"]} />
      <PageHeader title="Empleados" description="Gestión del equipo, horarios y desempeño." actions={<Button disabled title="Operación pendiente de implementación segura">+ Agregar empleado</Button>} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Empleado</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Horario</th>
              <th className="px-4 py-3">Citas</th>
              <th className="px-4 py-3">Ingresos generados</th>
              <th className="px-4 py-3">Comisión</th>
              <th className="px-4 py-3">Rating</th>
            </tr>
          </thead>
          <tbody>
            {EMPLOYEES.map((e) => (
              <tr key={e.id} className="border-t border-border-soft">
                <td className="flex items-center gap-2.5 px-4 py-3 font-medium text-plum">
                  <img src={e.image} className="h-8 w-8 rounded-full object-cover" alt={e.name} /> {e.name}
                </td>
                <td className="px-4 py-3 text-muted">{e.role}</td>
                <td className="px-4 py-3 text-muted">{e.schedule}</td>
                <td className="px-4 py-3 text-muted">—</td>
                <td className="px-4 py-3 text-muted">No disponible</td>
                <td className="px-4 py-3 text-muted">{e.commissionRate}%</td>
                <td className="px-4 py-3 text-muted">{e.rating ? `${e.rating} ★` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    <LinkStaff/>
</CrmShell>
  );
}

export function CrmServicios() {
  const { STYLISTS, SERVICES, PRODUCTS, getProduct } = useLiveData();

  const [selected, setSelected] = useState<Service>(SERVICES[0]);
  const [tab, setTab] = useState("General");

  if (!selected) return <CrmShell><PageHeader title="Servicios"/><p>No hay servicios registrados.</p></CrmShell>;
  const expectedCost = selected.materials.reduce((sum, m) => sum + m.expectedQty * (getProduct(m.productId)?.landedUnitCost ?? 0), 0);

  return (
    <CrmShell>
      <Breadcrumbs items={["Operaciones", "Servicios"]} />
      <PageHeader title="Servicios" description="Catálogo y recetas de materiales por tratamiento." actions={<Button disabled title="Operación pendiente de implementación segura">+ Nuevo servicio</Button>} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-3 lg:col-span-1">
          <div className="max-h-[560px] space-y-1 overflow-y-auto">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${selected.id === s.id ? "bg-blush/50" : "hover:bg-blush/20"}`}
              >
                <img src={s.image} className="h-10 w-10 rounded-md object-cover" alt={s.name} />
                <div className="flex-1">
                  <p className="font-medium text-plum">{s.name}</p>
                  <p className="text-xs text-muted">{formatUYU(s.price)}</p>
                </div>
                {s.active && <Badge tone="success">Activo</Badge>}
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <Tabs tabs={["General", "Materiales y consumo", "Especialistas asignados"]} active={tab} onChange={setTab} />
          {tab === "General" && (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted">Nombre</label>
                  <Input defaultValue={selected.name} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted">Categoría</label>
                  <Select defaultValue={selected.category}>
                    <option>{selected.category}</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted">Precio (UYU)</label>
                  <Input type="number" defaultValue={selected.price} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted">Duración (min)</label>
                  <Input type="number" defaultValue={selected.duration} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted">Seña requerida (UYU)</label>
                  <Input type="number" defaultValue={selected.deposit} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-muted">Estado</label>
                  <Select defaultValue={selected.active ? "Activo" : "Inactivo"}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </Select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-muted">Descripción</label>
                <Textarea rows={3} defaultValue={selected.description} />
              </div>
              <Button disabled title="Operación pendiente de implementación segura">Guardar cambios</Button>
            </div>
          )}
          {tab === "Materiales y consumo" && (
            <div className="mt-5">
              <p className="mb-3 text-sm text-muted">Receta estándar de consumo de materiales para este servicio.</p>
              <div className="overflow-x-auto rounded-lg border border-border-soft">
                <table className="w-full text-sm">
                  <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
                    <tr>
                      <th className="px-3 py-2">Producto</th>
                      <th className="px-3 py-2">Cantidad esperada</th>
                      <th className="px-3 py-2">Unidad</th>
                      <th className="px-3 py-2">Costo unitario</th>
                      <th className="px-3 py-2">Costo total esperado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.materials.map((m) => {
                      const p = getProduct(m.productId);
                      if (!p) return null;
                      return (
                        <tr key={m.productId} className="border-t border-border-soft">
                          <td className="px-3 py-2 font-medium text-plum">{p.name}</td>
                          <td className="px-3 py-2 text-muted">{m.expectedQty}</td>
                          <td className="px-3 py-2 text-muted">{m.unit}</td>
                          <td className="px-3 py-2 text-muted">{formatUYU(p.landedUnitCost)}</td>
                          <td className="px-3 py-2 font-semibold text-plum">{formatUYU(m.expectedQty * p.landedUnitCost)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-blush/20 p-4">
                <span className="text-sm font-semibold text-plum">Costo estándar estimado</span>
                <span className="font-display text-xl text-deep-rose">{formatUYU(expectedCost)}</span>
              </div>
              <Select className="mt-4 w-64" defaultValue="">
                <option value="" disabled>
                  + Agregar producto a la receta
                </option>
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {tab === "Especialistas asignados" && (
            <div className="mt-5 flex flex-wrap gap-2">
              {STYLISTS.map((st) => (
                <label key={st.id} className="flex items-center gap-2 rounded-full border border-border-soft px-3 py-1.5 text-sm">
                  <input type="checkbox" defaultChecked={selected.stylistIds.includes(st.id)} /> {st.name}
                </label>
              ))}
            </div>
          )}
        </Card>
      </div>
    </CrmShell>
  );
}
