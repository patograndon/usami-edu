"use client";

import { useState, useMemo } from "react";
import {
  UtensilsCrossed,
  Moon,
  Droplets,
  Palette,
  MessageSquare,
  Check,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { alumnos, cursos, dailyLogEntries, usuarios } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { useClientDate } from "@/hooks/useClientDate";
import {
  getCursoDisplayName,
  COMIDA_LABELS,
  CANTIDAD_LABELS,
  SIESTA_LABELS,
  HIGIENE_LABELS,
  APPROVAL_LABELS,
} from "@/types";
import type {
  DailyLogEntry,
  DailyLogCategory,
  ComidaTipo,
  ComidaCantidad,
  SiestaCalidad,
  HigieneTipo,
  ApprovalStatus,
} from "@/types";

const CATEGORY_CONFIG: Record<DailyLogCategory, { label: string; icon: typeof UtensilsCrossed; color: string }> = {
  comida: { label: "Comida", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-600 border-orange-300" },
  siesta: { label: "Siesta", icon: Moon, color: "bg-indigo-100 text-indigo-600 border-indigo-300" },
  higiene: { label: "Higiene", icon: Droplets, color: "bg-cyan-100 text-cyan-600 border-cyan-300" },
  actividad: { label: "Actividad", icon: Palette, color: "bg-pink-100 text-pink-600 border-pink-300" },
  observacion: { label: "Observación", icon: MessageSquare, color: "bg-gray-100 text-gray-600 border-gray-300" },
};

export default function DiarioPage() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();

  const isDirector = currentUser.role === "director";
  const canRegister = hasPermission("diario.registrar");
  const canApprove = hasPermission("diario.aprobar");

  const assignedCurso = currentUser.cursoAsignado;
  const cursoToShow = assignedCurso || cursos[0]?.id || "";
  const [selectedCurso, setSelectedCurso] = useState(cursoToShow);
  const cursoObj = cursos.find((c) => c.id === selectedCurso);

  const alumnosCurso = useMemo(
    () => alumnos.filter((a) => a.cursoId === selectedCurso && a.activo),
    [selectedCurso]
  );

  const [localEntries, setLocalEntries] = useState<DailyLogEntry[]>(dailyLogEntries);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DailyLogCategory | null>(null);

  const [comidaTipo, setComidaTipo] = useState<ComidaTipo>("desayuno");
  const [comidaCantidad, setComidaCantidad] = useState<ComidaCantidad>("todo");
  const [siestaInicio, setSiestaInicio] = useState("12:30");
  const [siestaFin, setSiestaFin] = useState("13:30");
  const [siestaCalidad, setSiestaCalidad] = useState<SiestaCalidad>("profunda");
  const [higieneTipo, setHigieneTipo] = useState<HigieneTipo>("muda");
  const [actividadDesc, setActividadDesc] = useState("");
  const [obsTexto, setObsTexto] = useState("");
  const [obsGeneral, setObsGeneral] = useState("");

  const { todayStr } = useClientDate();

  const todayEntries = useMemo(
    () => localEntries.filter((e) => e.cursoId === selectedCurso && e.date === todayStr),
    [localEntries, selectedCurso, todayStr]
  );

  const pendingCount = todayEntries.filter((e) => e.approvalStatus === "pending").length;

  function handleRegister() {
    if (!selectedStudent || !selectedCategory) return;
    const now = new Date();
    const entry: DailyLogEntry = {
      id: `dl-${Date.now()}`,
      tenantId: tenant.id,
      studentId: selectedStudent,
      cursoId: selectedCurso,
      date: todayStr,
      category: selectedCategory,
      timestamp: now.toISOString(),
      registeredBy: currentUser.id,
      registeredByRole: currentUser.role,
      approvalStatus: currentUser.role === "educadora" ? "approved" : "pending",
      approvedBy: currentUser.role === "educadora" ? currentUser.id : null,
      approvedAt: currentUser.role === "educadora" ? now.toISOString() : null,
      ...(selectedCategory === "comida" && { comida: { tipo: comidaTipo, cantidad: comidaCantidad, observacion: obsGeneral || undefined } }),
      ...(selectedCategory === "siesta" && { siesta: { inicio: siestaInicio, fin: siestaFin, calidad: siestaCalidad, observacion: obsGeneral || undefined } }),
      ...(selectedCategory === "higiene" && { higiene: { tipo: higieneTipo, observacion: obsGeneral || undefined } }),
      ...(selectedCategory === "actividad" && { actividad: { descripcion: actividadDesc, participacion: "activa" } }),
      ...(selectedCategory === "observacion" && { observacion: { texto: obsTexto } }),
    };
    setLocalEntries([entry, ...localEntries]);
    setSelectedStudent(null);
    setSelectedCategory(null);
    setObsGeneral("");
    setObsTexto("");
    setActividadDesc("");
  }

  function handleApproval(entryId: string, status: ApprovalStatus) {
    setLocalEntries(
      localEntries.map((e) =>
        e.id === entryId
          ? { ...e, approvalStatus: status, approvedBy: currentUser.id, approvedAt: new Date().toISOString() }
          : e
      )
    );
  }

  if (isDirector) {
    return <DirectorAuditView entries={localEntries} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diario de Aula</h1>
          <p className="text-sm text-gray-500">
            {cursoObj ? getCursoDisplayName(cursoObj) : ""} · Hoy
          </p>
        </div>
        {!assignedCurso && (
          <select
            value={selectedCurso}
            onChange={(e) => setSelectedCurso(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {cursos.filter((c) => c.activo).map((c) => (
              <option key={c.id} value={c.id}>{getCursoDisplayName(c)}</option>
            ))}
          </select>
        )}
      </div>

      {pendingCount > 0 && canApprove && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-600" />
          <p className="text-sm text-amber-700">
            <strong>{pendingCount} registro(s)</strong> pendientes de Visto Bueno
          </p>
        </div>
      )}

      {canRegister && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Registro Rápido</h2>

          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Alumno</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {alumnosCurso.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedStudent(a.id)}
                  className={`rounded-xl border-2 p-3 text-left transition-all active:scale-[0.97] ${
                    selectedStudent === a.id
                      ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900 truncate">{a.nombres}</p>
                  <p className="text-xs text-gray-500 truncate">{a.apellidoPaterno}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedStudent && (
            <>
              <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Registro</p>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {(Object.entries(CATEGORY_CONFIG) as [DailyLogCategory, typeof CATEGORY_CONFIG.comida][]).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all active:scale-[0.95] ${
                        selectedCategory === key
                          ? `${cfg.color} ring-1`
                          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                      <span className="text-xs font-semibold">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {selectedStudent && selectedCategory === "comida" && (
            <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="grid grid-cols-4 gap-2">
                {(Object.entries(COMIDA_LABELS) as [ComidaTipo, string][]).map(([k, l]) => (
                  <button key={k} onClick={() => setComidaTipo(k)}
                    className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium active:scale-[0.97] ${comidaTipo === k ? "border-orange-400 bg-orange-200 text-orange-800" : "border-gray-200 bg-white"}`}
                  >{l}</button>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(Object.entries(CANTIDAD_LABELS) as [ComidaCantidad, string][]).map(([k, l]) => (
                  <button key={k} onClick={() => setComidaCantidad(k)}
                    className={`rounded-lg border-2 px-2 py-2.5 text-xs font-medium active:scale-[0.97] ${comidaCantidad === k ? "border-orange-400 bg-orange-200 text-orange-800" : "border-gray-200 bg-white"}`}
                  >{l}</button>
                ))}
              </div>
              <input type="text" placeholder="Observación (opcional)" value={obsGeneral} onChange={(e) => setObsGeneral(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
            </div>
          )}

          {selectedStudent && selectedCategory === "siesta" && (
            <div className="space-y-3 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Inicio</label>
                  <input type="time" value={siestaInicio} onChange={(e) => setSiestaInicio(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Fin</label>
                  <input type="time" value={siestaFin} onChange={(e) => setSiestaFin(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(SIESTA_LABELS) as [SiestaCalidad, string][]).map(([k, l]) => (
                  <button key={k} onClick={() => setSiestaCalidad(k)}
                    className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium active:scale-[0.97] ${siestaCalidad === k ? "border-indigo-400 bg-indigo-200 text-indigo-800" : "border-gray-200 bg-white"}`}
                  >{l}</button>
                ))}
              </div>
            </div>
          )}

          {selectedStudent && selectedCategory === "higiene" && (
            <div className="grid grid-cols-4 gap-2 rounded-lg border border-cyan-200 bg-cyan-50 p-4">
              {(Object.entries(HIGIENE_LABELS) as [HigieneTipo, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setHigieneTipo(k)}
                  className={`rounded-lg border-2 px-3 py-3 text-sm font-medium active:scale-[0.97] ${higieneTipo === k ? "border-cyan-400 bg-cyan-200 text-cyan-800" : "border-gray-200 bg-white"}`}
                >{l}</button>
              ))}
            </div>
          )}

          {selectedStudent && selectedCategory === "actividad" && (
            <div className="rounded-lg border border-pink-200 bg-pink-50 p-4">
              <input type="text" placeholder="Descripción de la actividad..." value={actividadDesc} onChange={(e) => setActividadDesc(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
            </div>
          )}

          {selectedStudent && selectedCategory === "observacion" && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <textarea placeholder="Escriba la observación..." value={obsTexto} onChange={(e) => setObsTexto(e.target.value)} rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm resize-none" />
            </div>
          )}

          {selectedStudent && selectedCategory && (
            <button onClick={handleRegister}
              className="mt-4 w-full rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white hover:bg-primary-700 active:scale-[0.98]">
              Registrar {CATEGORY_CONFIG[selectedCategory].label}
              {currentUser.role === "asistente" && " (requiere Visto Bueno)"}
            </button>
          )}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Registros de Hoy ({todayEntries.length})
        </h2>
        {todayEntries.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">Sin registros hoy</p>
        ) : (
          <div className="space-y-2">
            {todayEntries.map((entry) => {
              const alumno = alumnos.find((a) => a.id === entry.studentId);
              const cfg = CATEGORY_CONFIG[entry.category];
              const Icon = cfg.icon;
              const registrar = usuarios.find((u) => u.id === entry.registeredBy);
              return (
                <div key={entry.id} className={`flex items-center gap-3 rounded-lg border p-3 ${
                  entry.approvalStatus === "pending" ? "border-amber-200 bg-amber-50" :
                  entry.approvalStatus === "rejected" ? "border-red-200 bg-red-50" :
                  "border-gray-100 bg-gray-50"
                }`}>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cfg.color.split(" ").slice(0, 2).join(" ")}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : entry.studentId}
                      <span className="ml-2 text-xs text-gray-500">{cfg.label}</span>
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {entry.comida && `${COMIDA_LABELS[entry.comida.tipo]}: ${CANTIDAD_LABELS[entry.comida.cantidad]}`}
                      {entry.siesta && `${entry.siesta.inicio}–${entry.siesta.fin} (${SIESTA_LABELS[entry.siesta.calidad]})`}
                      {entry.higiene && HIGIENE_LABELS[entry.higiene.tipo]}
                      {entry.actividad && entry.actividad.descripcion}
                      {entry.observacion && entry.observacion.texto}
                      {" · "}{registrar?.nombreCompleto.split(" ").slice(0, 2).join(" ")}
                      {" · "}{new Date(entry.timestamp).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.approvalStatus === "pending" && canApprove && (
                      <>
                        <button onClick={() => handleApproval(entry.id, "approved")}
                          className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-700 active:scale-[0.95]">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleApproval(entry.id, "rejected")}
                          className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600 active:scale-[0.95]">
                          <AlertTriangle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      entry.approvalStatus === "approved" ? "bg-emerald-100 text-emerald-700" :
                      entry.approvalStatus === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {APPROVAL_LABELS[entry.approvalStatus]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DirectorAuditView({ entries }: { entries: DailyLogEntry[] }) {
  const [filterCurso, setFilterCurso] = useState("");
  const [filterDate, setFilterDate] = useState("2026-06-16");
  const [filterCategory, setFilterCategory] = useState<DailyLogCategory | "">("");
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | "">("");

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filterCurso && e.cursoId !== filterCurso) return false;
      if (filterDate && e.date !== filterDate) return false;
      if (filterCategory && e.category !== filterCategory) return false;
      if (filterStatus && e.approvalStatus !== filterStatus) return false;
      return true;
    });
  }, [entries, filterCurso, filterDate, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    const s = { total: filtered.length, approved: 0, pending: 0, rejected: 0 };
    for (const e of filtered) {
      if (e.approvalStatus === "approved") s.approved++;
      else if (e.approvalStatus === "pending") s.pending++;
      else s.rejected++;
    }
    return s;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Auditoría — Diario de Aula</h1>
        <p className="text-sm text-gray-500">Vista global de registros diarios. Solo lectura.</p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Curso</label>
          <select value={filterCurso} onChange={(e) => setFilterCurso(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            {cursos.filter((c) => c.activo).map((c) => (
              <option key={c.id} value={c.id}>{getCursoDisplayName(c)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Fecha</label>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Tipo</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as DailyLogCategory | "")}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            {(Object.entries(CATEGORY_CONFIG) as [DailyLogCategory, typeof CATEGORY_CONFIG.comida][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ApprovalStatus | "")}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Todos</option>
            <option value="approved">Aprobado</option>
            <option value="pending">Pendiente</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{stats.approved}</p>
          <p className="text-xs text-emerald-600">Aprobados</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
          <p className="text-xs text-amber-600">Pendientes VB</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
          <p className="text-xs text-red-600">Rechazados</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-600">Hora</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Alumno</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Tipo</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Detalle</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Registrado por</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Sin registros para los filtros seleccionados</td></tr>
              ) : (
                filtered.map((entry) => {
                  const alumno = alumnos.find((a) => a.id === entry.studentId);
                  const registrar = usuarios.find((u) => u.id === entry.registeredBy);
                  const cfg = CATEGORY_CONFIG[entry.category];
                  const detalle =
                    entry.comida ? `${COMIDA_LABELS[entry.comida.tipo]}: ${CANTIDAD_LABELS[entry.comida.cantidad]}${entry.comida.observacion ? ` — ${entry.comida.observacion}` : ""}` :
                    entry.siesta ? `${entry.siesta.inicio}–${entry.siesta.fin} (${SIESTA_LABELS[entry.siesta.calidad]})` :
                    entry.higiene ? `${HIGIENE_LABELS[entry.higiene.tipo]}${entry.higiene.observacion ? ` — ${entry.higiene.observacion}` : ""}` :
                    entry.actividad ? entry.actividad.descripcion :
                    entry.observacion ? entry.observacion.texto : "";
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : entry.studentId}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{detalle}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {registrar?.nombreCompleto.split(" ").slice(0, 2).join(" ")}
                        <br />
                        <span className="text-gray-400">{registrar?.role === "asistente" ? "Asistente" : "Educadora"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          entry.approvalStatus === "approved" ? "bg-emerald-100 text-emerald-700" :
                          entry.approvalStatus === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {APPROVAL_LABELS[entry.approvalStatus]}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Exportar PDF
        </button>
        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Exportar Excel
        </button>
      </div>
    </div>
  );
}
