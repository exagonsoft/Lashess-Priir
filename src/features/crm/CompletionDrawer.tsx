"use client";
import { useLiveData } from "@/features/data/LiveData";
import { useEffect, useMemo, useState } from "react";
import { Drawer, Button, Input, Textarea, Badge, useToast } from "../../components/ui";
import { formatUYU } from "../../data/source";

interface ConsumptionLine {
  productId: string;
  expectedQty: number;
  actualQty: number;
  unit: string;
}

export default function CompletionDrawer({ appointmentId, onClose }: { appointmentId: string | null; onClose: () => void }) {
  const { APPOINTMENTS, PRODUCTS, SERVICES, getProduct } = useLiveData();

  const appointment = APPOINTMENTS.find((a) => a.id === appointmentId);
  const service = appointment ? SERVICES.find((s) => s.id === appointment.serviceId) : undefined;
  const { push } = useToast();

  const initialLines: ConsumptionLine[] = useMemo(
    () => (service ? service.materials.map((m) => ({ productId: m.productId, expectedQty: m.expectedQty, actualQty: m.expectedQty, unit: m.unit })) : []),
    [service]
  );
  const [lines, setLines] = useState<ConsumptionLine[]>(initialLines);
  const [notes, setNotes] = useState("");
  const [collectBalance, setCollectBalance] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  // Re-sync when appointment changes
  useEffect(() => {
    setLines(initialLines);
    setConfirmed(false);
  }, [appointmentId, initialLines]);

  if (!appointment || !service) return <Drawer open={!!appointmentId} onClose={onClose} title="Finalizar servicio"><p className="text-sm text-muted">Selecciona una cita.</p></Drawer>;

  const expectedCost = lines.reduce((sum, l) => sum + l.expectedQty * (getProduct(l.productId)?.landedUnitCost ?? 0), 0);
  const actualCost = lines.reduce((sum, l) => sum + l.actualQty * (getProduct(l.productId)?.landedUnitCost ?? 0), 0);
  const commissionRate = 0;
  const commission = Math.round(appointment.price * commissionRate);
  const margin = appointment.price - actualCost - commission;

  function updateQty(productId: string, qty: number) {
    setLines((cur) => cur.map((l) => (l.productId === productId ? { ...l, actualQty: Math.max(0, qty) } : l)));
  }
  function removeLine(productId: string) {
    setLines((cur) => cur.filter((l) => l.productId !== productId));
  }
  function addProduct(productId: string) {
    if (lines.some((l) => l.productId === productId)) return;
    const p = getProduct(productId);
    if (!p) return;
    setLines((cur) => [...cur, { productId, expectedQty: 0, actualQty: 1, unit: p.unit }]);
  }

  function confirmFinish() { push("La finalización requiere una operación atómica de inventario y comisiones. No se guardaron cambios.", "info"); }

  const availableToAdd = PRODUCTS.filter((p) => !lines.some((l) => l.productId === p.id));

  return (
    <Drawer
      open={!!appointmentId}
      onClose={onClose}
      title="Finalizar servicio"
      width="max-w-2xl"
      footer={
        !confirmed ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="outline" disabled title="Guardado de borrador no implementado">
              Guardar borrador
            </Button>
            <Button disabled title="Operación pendiente de implementación segura" onClick={confirmFinish}>Confirmar y finalizar</Button>
          </>
        ) : null
      }
    >
      {confirmed ? (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
          <p className="mt-4 font-display text-xl text-plum">Servicio completado</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            El inventario fue ajustado, el costo real del material fue registrado y la comisión de la especialista fue actualizada.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-plum/70">
            Consulta de materiales. No se deducirá stock ni se registrarán cobros o comisiones; la finalización transaccional está pendiente.
          </p>
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-blush/20 p-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase text-muted">Clienta</p>
              <p className="font-semibold text-plum">{appointment.customerName}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted">Servicio</p>
              <p className="font-semibold text-plum">{appointment.serviceName}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted">Especialista</p>
              <p className="font-semibold text-plum">{appointment.stylistName}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted">Duración</p>
              <p className="font-semibold text-plum">{appointment.duration} min</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-plum">Materiales utilizados</p>
              {availableToAdd.length > 0 && (
                <select
                  onChange={(e) => {
                    if (e.target.value) addProduct(e.target.value);
                    e.target.value = "";
                  }}
                  className="rounded-md border border-border-soft px-2 py-1 text-xs"
                  defaultValue=""
                >
                  <option value="" disabled>
                    + Agregar producto
                  </option>
                  {availableToAdd.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="overflow-x-auto rounded-lg border border-border-soft">
              <table className="w-full text-xs">
                <thead className="bg-blush/30 text-left uppercase text-muted">
                  <tr>
                    <th className="px-3 py-2">Producto</th>
                    <th className="px-3 py-2">Esperado</th>
                    <th className="px-3 py-2">Real</th>
                    <th className="px-3 py-2">Unidad</th>
                    <th className="px-3 py-2">Stock</th>
                    <th className="px-3 py-2">Costo unit.</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l) => {
                    const p = getProduct(l.productId);
                    if (!p) return null;
                    return (
                      <tr key={l.productId} className="border-t border-border-soft">
                        <td className="px-3 py-2 font-medium text-plum">{p.name}</td>
                        <td className="px-3 py-2 text-muted">{l.expectedQty}</td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            step="0.1"
                            value={l.actualQty}
                            onChange={(e) => updateQty(l.productId, Number(e.target.value))}
                            className="w-20 px-2 py-1"
                          />
                        </td>
                        <td className="px-3 py-2 text-muted">{l.unit}</td>
                        <td className="px-3 py-2 text-muted">{p.stock}</td>
                        <td className="px-3 py-2 text-muted">{formatUYU(p.landedUnitCost)}</td>
                        <td className="px-3 py-2 font-semibold text-plum">{formatUYU(l.actualQty * p.landedUnitCost)}</td>
                        <td className="px-3 py-2">
                          <button onClick={() => removeLine(l.productId)} className="text-muted hover:text-red-600">
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {lines.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-4 text-center text-muted">
                        Consumo cero registrado. Agregá una nota explicando el motivo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Textarea rows={2} placeholder="Notas sobre el consumo de materiales (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="rounded-xl border border-border-soft p-4">
            <p className="mb-3 text-sm font-semibold text-plum">Resumen de costos</p>
            <div className="space-y-1.5 text-sm">
              <Row label="Costo esperado de materiales" value={formatUYU(expectedCost)} />
              <Row label="Estimación de materiales (sin contabilizar)" value={formatUYU(actualCost)} />
              <Row label="Diferencia" value={formatUYU(actualCost - expectedCost)} highlight={actualCost > expectedCost} />
              <Row label="Valor nominal del servicio" value={formatUYU(appointment.price)} />
              <Row label="Comisión" value="No disponible" />
              <div className="mt-2 flex justify-between border-t border-border-soft pt-2 font-semibold text-plum">
                <span>Margen de contribución estimado</span>
                <span className="text-deep-rose">No disponible</span>
              </div>
              <p className="text-[11px] text-muted">* No incluye costos operativos generales (overhead).</p>
            </div>
          </div>

          <div className="rounded-xl border border-border-soft p-4">
            <p className="mb-2 text-sm font-semibold text-plum">Conciliación de pago</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Saldo pendiente</span>
              <span className="font-semibold text-plum">{formatUYU(appointment.remaining)}</span>
            </div>
            {appointment.remaining > 0 && (
              <label className="mt-3 flex items-center gap-2 text-sm text-plum/80">
                <input type="checkbox" checked={collectBalance} onChange={(e) => setCollectBalance(e.target.checked)} />
                Registrar cobro del saldo restante al finalizar
              </label>
            )}
            {appointment.remaining === 0 && <Badge tone="success" className="mt-2">Conciliación de pagos no disponible</Badge>}
          </div>
        </div>
      )}
    </Drawer>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span className={highlight ? "font-semibold text-red-600" : "text-plum"}>{value}</span>
    </div>
  );
}
