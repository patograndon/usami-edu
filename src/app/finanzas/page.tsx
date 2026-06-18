"use client";

import { useState, useMemo } from "react";
import { DollarSign, Plus, Save, X, FileText, AlertTriangle, Download } from "lucide-react";
import { receipts, alumnos, cursos } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { PAYMENT_STATUS_LABELS, RECEIPT_TYPE_LABELS } from "@/types";
import type { Receipt, PaymentStatus, ReceiptType } from "@/types";

const STATUS_COLORS: Record<PaymentStatus, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  pagado: "bg-emerald-100 text-emerald-700",
  vencido: "bg-red-100 text-red-700",
  anulado: "bg-gray-100 text-gray-500",
};

export default function FinanzasPage() {
  const { hasPermission } = useAuth();
  const { tenant } = useTenant();
  const canCreate = hasPermission("finanzas.crear");

  const [localReceipts, setLocalReceipts] = useState<Receipt[]>(receipts);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "">("");

  const [formStudent, setFormStudent] = useState("");
  const [formType, setFormType] = useState<ReceiptType>("mensualidad");
  const [formDesc, setFormDesc] = useState("");
  const [formMonto, setFormMonto] = useState(85000);
  const [formVenc, setFormVenc] = useState("");

  const filtered = useMemo(
    () => localReceipts.filter((r) => !filterStatus || r.status === filterStatus),
    [localReceipts, filterStatus]
  );

  const stats = useMemo(() => {
    const total = localReceipts.reduce((s, r) => s + r.monto, 0);
    const pagado = localReceipts.filter((r) => r.status === "pagado").reduce((s, r) => s + r.monto, 0);
    const pendiente = localReceipts.filter((r) => r.status === "pendiente").reduce((s, r) => s + r.monto, 0);
    const vencido = localReceipts.filter((r) => r.status === "vencido").reduce((s, r) => s + r.monto, 0);
    return { total, pagado, pendiente, vencido };
  }, [localReceipts]);

  function fmt(n: number) { return "$" + n.toLocaleString("es-CL"); }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const folio = `REC-2026-${String(localReceipts.length + 1).padStart(4, "0")}`;
    const rec: Receipt = {
      id: `rec-${Date.now()}`,
      tenantId: tenant.id,
      studentId: formStudent,
      type: formType,
      description: formDesc,
      monto: formMonto,
      fechaEmision: "2026-06-17",
      fechaVencimiento: formVenc,
      status: "pendiente",
      folio,
      createdBy: "usr-001",
    };
    setLocalReceipts([rec, ...localReceipts]);
    setShowForm(false);
    setFormStudent(""); setFormDesc(""); setFormMonto(85000); setFormVenc("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finanzas</h1>
          <p className="text-sm text-gray-500">Recibos y pagos — Estructura preliminar</p>
        </div>
        <div className="flex gap-2">
          {canCreate && (
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">
              <Plus className="h-4 w-4" /> Emitir Recibo
            </button>
          )}
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-xl font-bold text-gray-900">{fmt(stats.total)}</p>
          <p className="text-xs text-gray-500">Total Emitido</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-xl font-bold text-emerald-700">{fmt(stats.pagado)}</p>
          <p className="text-xs text-emerald-600">Recaudado</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-xl font-bold text-amber-700">{fmt(stats.pendiente)}</p>
          <p className="text-xs text-amber-600">Pendiente</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-xl font-bold text-red-700">{fmt(stats.vencido)}</p>
          <p className="text-xs text-red-600">Vencido</p>
        </div>
      </div>

      {stats.vencido > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">Hay recibos vencidos por {fmt(stats.vencido)}. Se recomienda contactar a los apoderados.</p>
        </div>
      )}

      {showForm && canCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Emitir Recibo Digital</h2>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Alumno *</label>
              <select value={formStudent} onChange={(e) => setFormStudent(e.target.value)} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm">
                <option value="">Seleccionar...</option>
                {alumnos.filter((a) => a.activo).map((a) => (
                  <option key={a.id} value={a.id}>{a.nombres} {a.apellidoPaterno} — {a.rut}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tipo *</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value as ReceiptType)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm">
                {(Object.entries(RECEIPT_TYPE_LABELS) as [ReceiptType, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Descripción *</label>
              <input type="text" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Monto (CLP) *</label>
              <input type="number" value={formMonto} onChange={(e) => setFormMonto(Number(e.target.value))} required min={1}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Vencimiento *</label>
              <input type="date" value={formVenc} onChange={(e) => setFormVenc(e.target.value)} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">Cancelar</button>
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              <Save className="h-4 w-4" /> Emitir Recibo
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 mb-2">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as PaymentStatus | "")}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="">Todos los estados</option>
          {(Object.entries(PAYMENT_STATUS_LABELS) as [PaymentStatus, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-5 py-3 font-semibold text-gray-600">Folio</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Alumno</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Tipo</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Descripción</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Monto</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Vencimiento</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((rec) => {
              const alumno = alumnos.find((a) => a.id === rec.studentId);
              return (
                <tr key={rec.id} className={`hover:bg-gray-50 ${rec.status === "vencido" ? "bg-red-50" : ""}`}>
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">{rec.folio}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : rec.studentId}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{RECEIPT_TYPE_LABELS[rec.type]}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{rec.description}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">{fmt(rec.monto)}</td>
                  <td className="px-5 py-3 text-gray-600">{rec.fechaVencimiento}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[rec.status]}`}>
                      {PAYMENT_STATUS_LABELS[rec.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-500">Sin recibos para este filtro</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Este módulo es una estructura preliminar. La conexión bancaria y pasarela de pago no están implementadas.
          Los recibos digitales están preparados para ser visibles en la futura App del Apoderado.
        </p>
      </div>
    </div>
  );
}
