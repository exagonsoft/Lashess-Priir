"use client";
import EditRecord from "@/features/data/EditRecord";
import { useLiveData } from "@/features/data/LiveData";
import { useMemo, useState } from "react";
import CrmShell from "./CrmShell";
import { PageHeader, Breadcrumbs } from "../../components/layout/PortalShell";
import { Button, Badge, Card, Input, Select, KpiCard, Tabs, Modal, Drawer } from "../../components/ui";
import { formatUYU, Product } from "../../data/source";

/* ---------------------------- PRODUCTOS ---------------------------- */
export function CrmProductos() {
  const { PRODUCTS, SUPPLIERS } = useLiveData();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(Product & {fixture?:boolean}) | null>(null);
  const filtered = PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <CrmShell>
      <Breadcrumbs items={["Operaciones", "Productos"]} />
      <PageHeader title="Catálogo de productos" description="Productos e insumos utilizados en los tratamientos." actions={<Button disabled title="Operación pendiente de implementación segura">+ Nuevo producto</Button>} />
      <Input placeholder="Buscar producto o SKU..." value={query} onChange={(e) => setQuery(e.target.value)} className="mb-5 sm:w-80" />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Costo landed</th>
              <th className="px-4 py-3">Precio venta</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Mínimo</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="cursor-pointer border-t border-border-soft hover:bg-blush/10" onClick={() => setSelected(p)}>
                <td className="flex items-center gap-2.5 px-4 py-3 font-medium text-plum">
                  <img src={p.image} className="h-8 w-8 rounded-md object-cover" alt={p.name} /> {p.name}
                </td>
                <td className="px-4 py-3 text-muted">{p.sku}</td>
                <td className="px-4 py-3 text-muted">{p.category}</td>
                <td className="px-4 py-3 text-muted">{formatUYU(p.landedUnitCost)}</td>
                <td className="px-4 py-3 text-muted">{p.sellingPrice ? formatUYU(p.sellingPrice) : "Uso interno"}</td>
                <td className="px-4 py-3 text-muted">
                  {p.stock} {p.unit}
                </td>
                <td className="px-4 py-3 text-muted">{p.minStock}</td>
                <td className="px-4 py-3">
                  {p.stock === 0 ? (
                    <Badge tone="danger">Sin stock</Badge>
                  ) : p.stock < p.minStock ? (
                    <Badge tone="warning">Stock bajo</Badge>
                  ) : (
                    <Badge tone="success">OK</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-4 text-sm">
            <img src={selected.image} className="h-40 w-full rounded-lg object-cover" alt={selected.name} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="SKU" value={selected.sku} />
              <Field label="Marca" value={selected.brand} />
              <Field label="Categoría" value={selected.category} />
              <Field label="Proveedor" value={SUPPLIERS.find((s) => s.id === selected.supplierId)?.name ?? "—"} />
              <EditRecord key={selected.id} collection="products" id={selected.id} fixture={selected.fixture} initial={{name:selected.name,sku:selected.sku,category:selected.category,brand:selected.brand,minStock:selected.minStock}}/><Field label="Precio de compra" value={formatUYU(selected.purchasePrice)} />
              <Field label="Costo landed" value={formatUYU(selected.landedUnitCost)} />
              <Field label="Precio de venta" value={selected.sellingPrice ? formatUYU(selected.sellingPrice) : "Uso interno"} />
              <Field label="Stock actual" value={`${selected.stock} ${selected.unit}`} />
              <Field label="Stock mínimo" value={String(selected.minStock)} />
              <Field label="Vencimiento" value={selected.expiration ?? "N/A"} />
            </div>
            <div className="border-t border-border-soft pt-4">
              <p className="mb-2 font-semibold text-plum">Historial de costos</p>
              <div className="space-y-1.5 text-xs text-muted">
                <div className="flex justify-between">
                  <span>28/01/2026 — Compra LashPro Uruguay</span>
                  <span>{formatUYU(selected.landedUnitCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>15/12/2025 — Compra anterior</span>
                  <span>{formatUYU(Math.round(selected.landedUnitCost * 0.94))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </CrmShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-muted">{label}</p>
      <p className="font-semibold text-plum">{value}</p>
    </div>
  );
}

/* ---------------------------- INVENTARIO ---------------------------- */
export function CrmInventarioDashboard() {
  const { PRODUCTS } = useLiveData();

  const [tab, setTab] = useState("Movimientos");
  const totalValue = PRODUCTS.reduce((sum, p) => sum + p.stock * p.landedUnitCost, 0);
  const lowStock = PRODUCTS.filter((p) => !p.fixture && p.stock < p.minStock);
  const outOfStock = PRODUCTS.filter((p) => !p.fixture && p.stock === 0);
  const expiringSoon = PRODUCTS.filter((p) => p.expiration);

  const movements: {id:string;date:string;product:string;type:string;qty:number;user:string;reason:string}[] = [];

  return (
    <CrmShell>
      <Breadcrumbs items={["Operaciones", "Inventario"]} />
      <PageHeader title="Inventario" description="Control de stock, valorización y movimientos." />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Total de productos" value={String(PRODUCTS.length)} />
        <KpiCard label="Valor contable de inventario" value="No disponible" />
        <KpiCard label="Stock bajo" value={String(lowStock.length)} deltaTone="danger" />
        <KpiCard label="Sin stock" value={String(outOfStock.length)} deltaTone="danger" />
      </div>
      <Tabs tabs={["Movimientos", "Stock bajo", "Próximos a vencer", "Operaciones"]} active={tab} onChange={setTab} className="mt-6" />
      <div className="mt-5">
        {tab === "Movimientos" && (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Responsable</th>
                  <th className="px-4 py-3">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id} className="border-t border-border-soft">
                    <td className="px-4 py-3 text-muted">{m.date}</td>
                    <td className="px-4 py-3 font-medium text-plum">{m.product}</td>
                    <td className="px-4 py-3">
                      <Badge tone={m.type === "Recepción" ? "success" : m.type === "Ajuste" ? "warning" : "info"}>{m.type}</Badge>
                    </td>
                    <td className={`px-4 py-3 font-semibold ${m.qty > 0 ? "text-emerald-600" : "text-red-600"}`}>{m.qty > 0 ? `+${m.qty}` : m.qty}</td>
                    <td className="px-4 py-3 text-muted">{m.user}</td>
                    <td className="px-4 py-3 text-muted">{m.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        {tab === "Stock bajo" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lowStock.map((p) => (
              <Card key={p.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <img src={p.image} className="h-10 w-10 rounded-md object-cover" alt={p.name} />
                  <div>
                    <p className="font-medium text-plum">{p.name}</p>
                    <p className="text-xs text-muted">
                      {p.stock} / {p.minStock} {p.unit}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Reponer
                </Button>
              </Card>
            ))}
            {lowStock.length === 0 && <p className="text-sm text-muted">No hay productos con stock bajo.</p>}
          </div>
        )}
        {tab === "Próximos a vencer" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {expiringSoon.map((p) => (
              <Card key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-plum">{p.name}</p>
                  <p className="text-xs text-muted">Vence: {p.expiration}</p>
                </div>
                <Badge tone="warning">Revisar</Badge>
              </Card>
            ))}
          </div>
        )}
        {tab === "Operaciones" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Recepción de stock", "Ajuste de inventario", "Registrar consumo", "Producto dañado / vencido"].map((op) => (
              <Card key={op} className="p-5 text-center">
                <p className="font-semibold text-plum">{op}</p>
                <Button size="sm" variant="outline" className="mt-3">
                  Registrar
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CrmShell>
  );
}

/* ---------------------------- PROVEEDORES ---------------------------- */
export function CrmProveedores() {
  const { SUPPLIERS, PURCHASES } = useLiveData();

  const [selected, setSelected] = useState<(typeof SUPPLIERS)[number] | null>(null);
  return (
    <CrmShell>
      <Breadcrumbs items={["Operaciones", "Proveedores"]} />
      <PageHeader title="Proveedores" description="Directorio de proveedores y estado de cuentas." actions={<Button disabled title="Operación pendiente de implementación segura">+ Nuevo proveedor</Button>} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPLIERS.map((s) => (
          <Card key={s.id} className="p-5">
            <p className="font-display text-lg text-plum">{s.name}</p>
            <p className="text-xs text-muted">{s.category}</p>
            <div className="mt-3 space-y-1.5 text-sm text-plum/80">
              <p>Contacto: {s.contact}</p>
              <p>{s.phone}</p>
              <p>{s.email}</p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-3 text-sm">
              <span className="text-muted">Saldo pendiente</span>
              <span className={`font-semibold ${s.outstandingBalance > 0 ? "text-red-600" : "text-emerald-600"}`}>No disponible</span>
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setSelected(s)}>
              Ver historial
            </Button>
          </Card>
        ))}
      </div>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-4 text-sm">
            <EditRecord key={selected.id} collection="suppliers" id={selected.id} fixture={selected.fixture} initial={{name:selected.name,contact:selected.contact,email:selected.email,phone:selected.phone}}/><p className="text-muted">Última compra: {selected.lastPurchase}</p>
            <div className="space-y-2">
              {PURCHASES.filter((p) => p.supplierId === selected.id).map((p) => (
                <div key={p.id} className="rounded-lg border border-border-soft px-3 py-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-plum">Factura {p.invoice}</span>
                    <Badge tone={p.paymentStatus === "Pagado" ? "success" : p.paymentStatus === "Parcial" ? "warning" : "danger"}>{p.paymentStatus}</Badge>
                  </div>
                  <p className="text-xs text-muted">{p.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </CrmShell>
  );
}

/* ---------------------------- COMPRAS (landed cost) ---------------------------- */
export function CrmCompras() {
  const { SUPPLIERS, PURCHASES } = useLiveData();

  const [showNew, setShowNew] = useState(false);
  return (
    <CrmShell>
      <Breadcrumbs items={["Operaciones", "Compras"]} />
      <PageHeader title="Compras" description="Registro de compras y costos de adquisición (landed cost)." actions={<Button disabled title="Operación pendiente de implementación segura" onClick={() => setShowNew(true)}>+ Nueva compra</Button>} />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-blush/30 text-left text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Factura</th>
              <th className="px-4 py-3">Proveedor</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Gastos adicionales</th>
              <th className="px-4 py-3">Costo total</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {PURCHASES.map((p) => {
              const supplier = SUPPLIERS.find((s) => s.id === p.supplierId);
              const itemsTotal = p.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
              const expensesTotal = p.expenses.reduce((sum, e) => sum + e.amount, 0);
              return (
                <tr key={p.id} className="border-t border-border-soft">
                  <td className="px-4 py-3 font-medium text-plum">{p.invoice}</td>
                  <td className="px-4 py-3 text-muted">{supplier?.name}</td>
                  <td className="px-4 py-3 text-muted">{p.date}</td>
                  <td className="px-4 py-3 text-muted">{formatUYU(itemsTotal)}</td>
                  <td className="px-4 py-3 text-muted">{formatUYU(expensesTotal)}</td>
                  <td className="px-4 py-3 font-semibold text-plum">{formatUYU(itemsTotal + expensesTotal)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.paymentStatus === "Pagado" ? "success" : p.paymentStatus === "Parcial" ? "warning" : "danger"}>{p.paymentStatus}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <NewPurchaseModal open={showNew} onClose={() => setShowNew(false)} />
    </CrmShell>
  );
}

interface NewItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}
interface NewExpense {
  id: number;
  category: string;
  description: string;
  amount: number;
}

function NewPurchaseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { PRODUCTS, SUPPLIERS, getProduct } = useLiveData();

  const [items, setItems] = useState<NewItem[]>([
    { productId: "p-1", quantity: 10, unitPrice: 500 },
    { productId: "p-2", quantity: 20, unitPrice: 100 },
  ]);
  const [expenses, setExpenses] = useState<NewExpense[]>([{ id: 1, category: "Transporte", description: "Flete", amount: 600 }]);
  const [method, setMethod] = useState<"value" | "quantity">("value");

  const itemsTotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const expensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const landedTotal = itemsTotal + expensesTotal;

  const allocation = useMemo(() => {
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    return items.map((i) => {
      const subtotal = i.quantity * i.unitPrice;
      const share = method === "value" ? (itemsTotal ? subtotal / itemsTotal : 0) : totalQty ? i.quantity / totalQty : 0;
      const allocated = share * expensesTotal;
      const landedUnit = (subtotal + allocated) / (i.quantity || 1);
      return { ...i, subtotal, allocated, landedUnit };
    });
  }, [items, expensesTotal, method, itemsTotal]);

  function updateItem(idx: number, field: keyof NewItem, value: number | string) {
    setItems((cur) => cur.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }
  function addItem() {
    setItems((cur) => [...cur, { productId: PRODUCTS[0].id, quantity: 1, unitPrice: 0 }]);
  }
  function addExpense() {
    setExpenses((cur) => [...cur, { id: Date.now(), category: "Otro", description: "", amount: 0 }]);
  }
  function updateExpense(id: number, field: keyof NewExpense, value: number | string) {
    setExpenses((cur) => cur.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  return (
    <Modal open={open} onClose={onClose} title="Nueva compra" size="xl" footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button disabled title="Operación pendiente de implementación segura" onClick={onClose}>Registrar compra</Button></>}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Select defaultValue={SUPPLIERS[0].id}>
            {SUPPLIERS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Input type="date" defaultValue="2026-02-10" />
          <Input placeholder="N° de factura" />
          <Select defaultValue="Pendiente">
            <option>Pagado</option>
            <option>Pendiente</option>
            <option>Parcial</option>
          </Select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-plum">Productos comprados</p>
            <Button disabled title="Operación pendiente de implementación segura" size="sm" variant="outline" onClick={addItem}>
              + Agregar producto
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border-soft">
            <table className="w-full text-xs">
              <thead className="bg-blush/30 text-left uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Precio unitario</th>
                  <th className="px-3 py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-t border-border-soft">
                    <td className="px-3 py-2">
                      <Select value={it.productId} onChange={(e) => updateItem(idx, "productId", e.target.value)} className="px-2 py-1">
                        {PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Input type="number" value={it.quantity} onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} className="w-20 px-2 py-1" />
                    </td>
                    <td className="px-3 py-2">
                      <Input type="number" value={it.unitPrice} onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))} className="w-24 px-2 py-1" />
                    </td>
                    <td className="px-3 py-2 font-semibold text-plum">{formatUYU(it.quantity * it.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-plum">Gastos adicionales de adquisición</p>
            <Button disabled title="Operación pendiente de implementación segura" size="sm" variant="outline" onClick={addExpense}>
              + Agregar gasto
            </Button>
          </div>
          <div className="space-y-2">
            {expenses.map((e) => (
              <div key={e.id} className="grid grid-cols-4 gap-2">
                <Select value={e.category} onChange={(ev) => updateExpense(e.id, "category", ev.target.value)}>
                  {["Transporte", "Aduana", "Seguro", "Embalaje", "Otro"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
                <Input placeholder="Descripción" value={e.description} onChange={(ev) => updateExpense(e.id, "description", ev.target.value)} className="col-span-2" />
                <Input type="number" value={e.amount} onChange={(ev) => updateExpense(e.id, "amount", Number(ev.target.value))} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-plum">Método de distribución de costos</p>
          <div className="flex gap-2">
            {[
              { id: "value", label: "Proporcional por valor" },
              { id: "quantity", label: "Proporcional por cantidad" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold ${method === m.id ? "border-fashion bg-fashion text-white" : "border-border-soft text-plum"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border-soft p-4">
          <p className="mb-3 text-sm font-semibold text-plum">Cálculo de costo landed</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-left uppercase text-muted">
                <tr>
                  <th className="py-1.5">Producto</th>
                  <th className="py-1.5">Subtotal</th>
                  <th className="py-1.5">Costo asignado</th>
                  <th className="py-1.5">Costo landed unitario</th>
                </tr>
              </thead>
              <tbody>
                {allocation.map((a) => (
                  <tr key={a.productId} className="border-t border-border-soft">
                    <td className="py-1.5 font-medium text-plum">{getProduct(a.productId)?.name}</td>
                    <td className="py-1.5 text-muted">{formatUYU(a.subtotal)}</td>
                    <td className="py-1.5 text-muted">{formatUYU(Math.round(a.allocated))}</td>
                    <td className="py-1.5 font-semibold text-deep-rose">{formatUYU(Math.round(a.landedUnit))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border-soft pt-3 text-sm">
            <div>
              <p className="text-xs text-muted">Subtotal productos</p>
              <p className="font-semibold text-plum">{formatUYU(itemsTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Gastos adicionales</p>
              <p className="font-semibold text-plum">{formatUYU(expensesTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Costo total landed</p>
              <p className="font-display text-lg text-deep-rose">{formatUYU(landedTotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
