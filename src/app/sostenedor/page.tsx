"use client";

import { useState, useMemo } from "react";
import {
  Building2, Users, DollarSign, TrendingUp, BarChart3,
  AlertTriangle, Check, X, Clock, FileText, Shield,
  ChevronDown, ChevronUp, Star, Briefcase,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  tenantsSaaS, liquidaciones, leaveRequests, sedeMetrics,
  usuarios, auditLogs,
} from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import {
  PLAN_LABELS, ROLE_LABELS, LEAVE_TYPE_LABELS, LEAVE_STATUS_LABELS,
} from "@/types";
import type {
  Liquidacion, LeaveRequest, PayrollStatus, LeaveRequestStatus,
} from "@/types";

type Tab = "overview" | "sedes" | "nomina" | "permisos" | "metricas";

const PAYROLL_STATUS: Record<PayrollStatus, { label: string; color: string }> = {
  borrador: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  visado_director: { label: "Visado Director", color: "bg-blue-100 text-blue-700" },
  aprobado: { label: "Aprobado", color: "bg-emerald-100 text-emerald-700" },
  pagado: { label: "Pagado", color: "bg-green-100 text-green-800" },
};

const LEAVE_STATUS_COLORS: Record<LeaveRequestStatus, string> = {
  solicitado: "bg-gray-100 text-gray-600",
  visado_director: "bg-blue-100 text-blue-700",
  aprobado_sostenedor: "bg-emerald-100 text-emerald-700",
  rechazado: "bg-red-100 text-red-700",
};

function fmt(n: number) { return "$" + n.toLocaleString("es-CL"); }

export default function SostenedorPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [localLiquidaciones, setLocalLiquidaciones] = useState<Liquidacion[]>(liquidaciones);
  const [localLeaves, setLocalLeaves] = useState<LeaveRequest[]>(leaveRequests);

  if (currentUser.role !== "sostenedor" && currentUser.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Shield className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">Panel exclusivo para Sostenedores.</p>
      </div>
    );
  }

  const totalIngresos = sedeMetrics.reduce((s, m) => s + m.ingresosMes, 0);
  const totalCostos = sedeMetrics.reduce((s, m) => s + m.costosMes, 0);
  const totalAlumnos = sedeMetrics.reduce((s, m) => s + m.alumnosActivos, 0);
  const totalPersonal = sedeMetrics.reduce((s, m) => s + m.personalActivo, 0);
  const pendingLeaves = localLeaves.filter((l) => l.status === "visado_director").length;
  const pendingPayroll = localLiquidaciones.filter((l) => l.status === "visado_director").length;

  const financeChart = sedeMetrics.map((m) => ({
    name: m.nombre.split(" ").slice(0, 2).join(" "),
    ingresos: m.ingresosMes,
    costos: m.costosMes,
    margen: m.ingresosMes - m.costosMes,
  }));

  function handleApprovePayroll(id: string) {
    setLocalLiquidaciones(localLiquidaciones.map((l) => l.id === id ? { ...l, status: "aprobado" as PayrollStatus } : l));
  }

  function handleApproveLeave(id: string, approved: boolean) {
    setLocalLeaves(localLeaves.map((l) =>
      l.id === id ? { ...l, status: approved ? "aprobado_sostenedor" as LeaveRequestStatus : "rechazado" as LeaveRequestStatus, sostenedorApproval: approved } : l
    ));
  }

  const tabs: { id: Tab; label: string; icon: typeof Building2; badge?: number }[] = [
    { id: "overview", label: "Resumen", icon: BarChart3 },
    { id: "sedes", label: "Sedes", icon: Building2 },
    { id: "nomina", label: "Nómina", icon: DollarSign, badge: pendingPayroll },
    { id: "permisos", label: "Permisos y Licencias", icon: Briefcase, badge: pendingLeaves },
    { id: "metricas", label: "Métricas", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-yellow-600" />
          <h1 className="text-2xl font-bold text-gray-900">Consola del Sostenedor</h1>
        </div>
        <p className="text-sm text-gray-500">{currentUser.nombreCompleto} · {sedeMetrics.length} establecimientos</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KPI label="Sedes Activas" value={sedeMetrics.length} color="primary" />
        <KPI label="Alumnos Total" value={totalAlumnos} color="blue" />
        <KPI label="Personal Total" value={totalPersonal} color="violet" />
        <KPI label="Ingresos Mes" value={fmt(totalIngresos)} color="emerald" />
        <KPI label="Costos Mes" value={fmt(totalCostos)} color="red" />
        <KPI label="Margen" value={fmt(totalIngresos - totalCostos)} color={totalIngresos > totalCostos ? "emerald" : "red"} />
      </div>

      {(pendingLeaves > 0 || pendingPayroll > 0) && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700">
            {pendingPayroll > 0 && <><strong>{pendingPayroll}</strong> liquidación(es) pendiente(s) de aprobación. </>}
            {pendingLeaves > 0 && <><strong>{pendingLeaves}</strong> permiso(s) visado(s) por Director esperando su decisión.</>}
          </p>
        </div>
      )}

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <tab.icon className="h-4 w-4" />{tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
              <DollarSign className="h-5 w-5 text-emerald-500" /> Ingresos vs Costos por Sede
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v) => [fmt(v as number)]} />
                  <Bar dataKey="ingresos" fill="#22c55e" radius={[3, 3, 0, 0]} name="Ingresos" />
                  <Bar dataKey="costos" fill="#ef4444" radius={[3, 3, 0, 0]} name="Costos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
              <Star className="h-5 w-5 text-amber-500" /> KPIs por Sede
            </h2>
            <div className="space-y-3">
              {sedeMetrics.map((m) => (
                <div key={m.tenantId} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-sm font-semibold text-gray-900">{m.nombre}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className={`text-lg font-bold ${m.asistenciaAlumnos >= 85 ? "text-emerald-600" : "text-red-600"}`}>{m.asistenciaAlumnos}%</p>
                      <p className="text-[10px] text-gray-500">Asist. Niños</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{m.satisfaccionApoderados}%</p>
                      <p className="text-[10px] text-gray-500">Satisfacción</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-violet-600">{m.rotacionPersonal}%</p>
                      <p className="text-[10px] text-gray-500">Rotación</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "sedes" && (
        <div className="space-y-3">
          {tenantsSaaS.map((t) => (
            <div key={t.id} className={`rounded-xl border bg-white p-5 ${t.isActive ? "border-gray-200" : "border-gray-200 opacity-60"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary-500" />
                  <div>
                    <p className="font-bold text-gray-900">{t.nombre}</p>
                    <p className="text-xs text-gray-500">RBD: {t.rbd} · {t.comuna}, {t.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    t.plan === "enterprise" ? "bg-violet-100 text-violet-700" : t.plan === "profesional" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}>{PLAN_LABELS[t.plan]}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {t.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-3 text-center text-sm">
                <div><p className="font-bold text-gray-900">{t.alumnosCount}</p><p className="text-xs text-gray-500">Alumnos</p></div>
                <div><p className="font-bold text-gray-900">{t.personalCount}</p><p className="text-xs text-gray-500">Personal</p></div>
                <div><p className="font-bold text-gray-900">{t.modulosActivos.length}</p><p className="text-xs text-gray-500">Módulos</p></div>
                <div><p className="font-bold text-gray-900">{t.storageUsedMb} MB</p><p className="text-xs text-gray-500">Almacenamiento</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "nomina" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Liquidaciones de Sueldo — Junio 2026</h2>
            <p className="text-xs text-gray-500">Las liquidaciones requieren Visado del Director antes de la aprobación del Sostenedor</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 font-semibold text-gray-600">Personal</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Sueldo Base</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Bonos</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Descuentos</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Total Líquido</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Visado</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Estado</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {localLiquidaciones.map((liq) => {
                  const user = usuarios.find((u) => u.id === liq.userId);
                  const st = PAYROLL_STATUS[liq.status];
                  return (
                    <tr key={liq.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{user?.nombreCompleto || liq.userId}</p>
                        <p className="text-xs text-gray-500">{user ? ROLE_LABELS[user.role] : ""}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-700">{fmt(liq.sueldoBase)}</td>
                      <td className="px-5 py-3 text-emerald-600">+{fmt(liq.bonos)}</td>
                      <td className="px-5 py-3 text-red-600">-{fmt(liq.descuentos)}</td>
                      <td className="px-5 py-3 font-bold text-gray-900">{fmt(liq.totalLiquido)}</td>
                      <td className="px-5 py-3">
                        {liq.visadoPorDirector ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="h-3 w-3" /> Sí</span>
                        ) : (
                          <span className="text-xs text-gray-400">Pendiente</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-5 py-3">
                        {liq.status === "visado_director" && (
                          <button onClick={() => handleApprovePayroll(liq.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                            Aprobar
                          </button>
                        )}
                        {liq.pdfUrl && (
                          <span className="flex items-center gap-1 text-xs text-primary-600"><FileText className="h-3 w-3" /> PDF</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "permisos" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Flujo: Docente solicita → Director visa → Sostenedor aprueba/rechaza
          </p>
          {localLeaves.map((lr) => (
            <div key={lr.id} className={`rounded-xl border bg-white p-5 ${
              lr.status === "visado_director" ? "border-amber-300 bg-amber-50" : "border-gray-200"
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-gray-900">{lr.userName}</p>
                  <p className="text-sm text-gray-600">{LEAVE_TYPE_LABELS[lr.type]} · {lr.days} día(s)</p>
                  <p className="text-xs text-gray-500">{lr.startDate} → {lr.endDate}</p>
                  <p className="mt-1 text-sm text-gray-700">Motivo: {lr.reason}</p>
                  {lr.directorComment && (
                    <p className="mt-1 text-xs text-blue-600">Director: {lr.directorComment}</p>
                  )}
                  {lr.replacementName && (
                    <p className="mt-1 text-xs text-violet-600">Reemplazo: {lr.replacementName}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEAVE_STATUS_COLORS[lr.status]}`}>
                    {LEAVE_STATUS_LABELS[lr.status]}
                  </span>
                  {lr.directorApproval !== null && (
                    <span className={`flex items-center gap-1 text-xs ${lr.directorApproval ? "text-emerald-600" : "text-red-600"}`}>
                      <Shield className="h-3 w-3" /> Director: {lr.directorApproval ? "Aprobó" : "Rechazó"}
                    </span>
                  )}
                  {lr.status === "visado_director" && (
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleApproveLeave(lr.id, true)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                        <Check className="h-3 w-3" /> Aprobar
                      </button>
                      <button onClick={() => handleApproveLeave(lr.id, false)}
                        className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">
                        <X className="h-3 w-3" /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "metricas" && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 font-semibold text-gray-600">Sede</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Asist. Niños</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Asist. Personal</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Ingresos</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Costos</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Margen</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Satisfacción</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">D170</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Rotación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sedeMetrics.map((m) => (
                  <tr key={m.tenantId} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{m.nombre}</td>
                    <td className="px-5 py-3"><span className={`font-bold ${m.asistenciaAlumnos >= 85 ? "text-emerald-600" : "text-red-600"}`}>{m.asistenciaAlumnos}%</span></td>
                    <td className="px-5 py-3"><span className="font-bold text-blue-600">{m.asistenciaPersonal}%</span></td>
                    <td className="px-5 py-3 text-emerald-600">{fmt(m.ingresosMes)}</td>
                    <td className="px-5 py-3 text-red-600">{fmt(m.costosMes)}</td>
                    <td className="px-5 py-3 font-bold text-gray-900">{fmt(m.ingresosMes - m.costosMes)}</td>
                    <td className="px-5 py-3"><span className="font-bold text-primary-600">{m.satisfaccionApoderados}%</span></td>
                    <td className="px-5 py-3">{m.cumplimientoD170 > 0 ? <span className="font-bold text-violet-600">{m.cumplimientoD170}%</span> : <span className="text-gray-400">N/A</span>}</td>
                    <td className="px-5 py-3"><span className={`font-bold ${m.rotacionPersonal <= 5 ? "text-emerald-600" : "text-amber-600"}`}>{m.rotacionPersonal}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Todas las acciones del Sostenedor quedan registradas en el AuditLog con tenant_id, acción, detalle e IP.
              Las liquidaciones y permisos requieren Visado del Director previo a la decisión del Sostenedor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    primary: "border-primary-200 bg-primary-50 text-primary-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  };
  return (
    <div className={`rounded-xl border p-3 text-center ${colors[color] || colors.primary}`}>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] font-medium">{label}</p>
    </div>
  );
}
