"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  FileText,
  Download,
  Lock,
  Stethoscope,
  Brain,
} from "lucide-react";
import Link from "next/link";
import {
  alumnos, cursos, decreto170Records, specialistSessions,
  getDecreto170Alerts, getSessionsForStudent, usuarios,
} from "@/data/mock";
import { useTenant } from "@/context/TenantContext";
import {
  LOGRO_LABELS, SESSION_TYPE_LABELS, NEE_LABELS,
} from "@/types";
import type { LogroNivel } from "@/types";

const LOGRO_COLORS: Record<LogroNivel, string> = {
  1: "bg-red-100 text-red-700",
  2: "bg-red-100 text-red-600",
  3: "bg-orange-100 text-orange-700",
  4: "bg-amber-100 text-amber-700",
  5: "bg-lime-100 text-lime-700",
  6: "bg-emerald-100 text-emerald-700",
  7: "bg-green-100 text-green-800",
};

const SEMAFORO_STYLES = {
  rojo: "bg-red-500",
  naranja: "bg-orange-500",
  amarillo: "bg-yellow-400",
  verde: "bg-emerald-500",
};

export default function Decreto170Page() {
  const { modulosHabilitados } = useTenant();
  const alerts = useMemo(() => getDecreto170Alerts(), []);

  if (!modulosHabilitados.decreto170) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Módulo no disponible</p>
        <p className="mt-1 text-sm text-gray-400">
          El Decreto 170 solo está habilitado para Escuelas de Lenguaje.
        </p>
      </div>
    );
  }

  const byUrgency = {
    critico: alerts.filter((a) => a.semaforo === "rojo"),
    urgente: alerts.filter((a) => a.semaforo === "naranja"),
    proximo: alerts.filter((a) => a.semaforo === "amarillo"),
    ok: alerts.filter((a) => a.semaforo === "verde"),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Decreto 170 — Panel de Auditoría</h1>
          <p className="text-sm text-gray-500">
            {decreto170Records.length} alumnos PIE · {specialistSessions.length} sesiones · Escala 1-7 MINEDUC
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/decreto170/fuei"
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700">
            <FileText className="h-4 w-4" /> Gestionar FUEI
          </Link>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" /> Exportar Expedientes
          </button>
        </div>
      </div>

      <div className="rounded-xl border-2 border-gray-300 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Semáforo de Vencimiento — Reevaluaciones</h2>
        <p className="mb-4 text-sm text-gray-500">Fecha de reevaluación = Fecha de ingreso PIE + 12 meses (según norma)</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
          <SemaforoCard color="rojo" label="Vencidos" count={byUrgency.critico.length} description="Reevaluación vencida" />
          <SemaforoCard color="naranja" label="≤ 30 días" count={byUrgency.urgente.length} description="Próximos a vencer" />
          <SemaforoCard color="amarillo" label="≤ 60 días" count={byUrgency.proximo.length} description="Atención" />
          <SemaforoCard color="verde" label="> 60 días" count={byUrgency.ok.length} description="En regla" />
        </div>

        <div className="space-y-2">
          {alerts.map((alerta) => (
            <div
              key={alerta.studentId}
              className={`flex items-center gap-4 rounded-lg border p-3 ${
                alerta.semaforo === "rojo" ? "border-red-300 bg-red-50" :
                alerta.semaforo === "naranja" ? "border-orange-300 bg-orange-50" :
                alerta.semaforo === "amarillo" ? "border-yellow-300 bg-yellow-50" :
                "border-gray-200 bg-gray-50"
              }`}
            >
              <div className={`h-4 w-4 shrink-0 rounded-full ${SEMAFORO_STYLES[alerta.semaforo]}`} />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{alerta.studentName}</p>
                <p className="text-xs text-gray-500">
                  {alerta.diagnostico} · {NEE_LABELS[alerta.neeType]} · Vence: {alerta.fechaVencimiento}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                alerta.semaforo === "rojo" ? "bg-red-600 text-white" :
                alerta.semaforo === "naranja" ? "bg-orange-500 text-white" :
                alerta.semaforo === "amarillo" ? "bg-yellow-400 text-yellow-900" :
                "bg-emerald-100 text-emerald-700"
              }`}>
                {alerta.diasRestantes <= 0
                  ? `Vencido hace ${Math.abs(alerta.diasRestantes)}d`
                  : `${alerta.diasRestantes}d restantes`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Registros FUEI</h2>
          <Link href="/decreto170/fuei" className="text-sm font-medium text-violet-600 hover:text-violet-700">
            Crear FUEI
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 font-semibold text-gray-600">Semáforo</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Alumno</th>
                <th className="px-5 py-3 font-semibold text-gray-600">CIE-10</th>
                <th className="px-5 py-3 font-semibold text-gray-600">NEE</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Ingreso PIE</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Reevaluación</th>
                <th className="px-5 py-3 font-semibold text-gray-600">FUEI</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Sesiones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {decreto170Records.map((rec) => {
                const alumno = alumnos.find((a) => a.id === rec.studentId);
                const sessions = getSessionsForStudent(rec.studentId);
                const alert = alerts.find((a) => a.studentId === rec.studentId);
                const semaforo = alert?.semaforo || "verde";
                return (
                  <tr key={rec.id} className={`hover:bg-gray-50 ${
                    semaforo === "rojo" ? "bg-red-50" :
                    semaforo === "naranja" ? "bg-orange-50" : ""
                  }`}>
                    <td className="px-5 py-3">
                      <div className={`h-3.5 w-3.5 rounded-full ${SEMAFORO_STYLES[semaforo]}`} />
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : rec.studentId}
                    </td>
                    <td className="px-5 py-3 font-mono text-gray-600">{rec.diagnosticoCie10}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                        {NEE_LABELS[rec.neeType]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{rec.fechaIngresoPie}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        semaforo === "rojo" ? "bg-red-200 text-red-800" :
                        semaforo === "naranja" ? "bg-orange-200 text-orange-800" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {rec.fechaVencimientoReevaluacion}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {rec.fueiId ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <FileText className="h-3.5 w-3.5" /> Registrado
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 font-medium">Pendiente</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                        {sessions.length}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Bitácora de Sesiones — Escala 1-7</h2>
          <p className="text-xs text-gray-500">Registros inalterables para auditoría MINEDUC</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 font-semibold text-gray-600">Fecha</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Alumno</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Especialista</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Tipo</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Objetivo</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Logro</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...specialistSessions].sort((a, b) => b.date.localeCompare(a.date)).map((s) => {
                const alumno = alumnos.find((a) => a.id === s.studentId);
                const specialist = usuarios.find((u) => u.id === s.specialistId);
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{s.date}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : s.studentId}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        {s.specialistRole === "psicologo" ? <Brain className="h-3.5 w-3.5 text-fuchsia-500" /> : <Stethoscope className="h-3.5 w-3.5 text-violet-500" />}
                        <span className="text-xs">{specialist?.nombreCompleto.split(" ").slice(0, 2).join(" ")}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-600">{SESSION_TYPE_LABELS[s.type]} · {s.durationMinutes}m</span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{s.objetivoTrabajado}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${LOGRO_COLORS[s.nivelLogro]}`}>
                        {s.nivelLogro}/7 {LOGRO_LABELS[s.nivelLogro]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {s.locked ? (
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Lock className="h-3 w-3" /> Inalterable</span>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">Pendiente bloqueo</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download className="h-4 w-4" /> Exportar Expedientes PDF
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download className="h-4 w-4" /> Exportar Bitácora Excel
        </button>
      </div>
    </div>
  );
}

function SemaforoCard({ color, label, count, description }: { color: keyof typeof SEMAFORO_STYLES; label: string; count: number; description: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className={`h-5 w-5 shrink-0 rounded-full ${SEMAFORO_STYLES[color]}`} />
      <div>
        <p className="text-xl font-bold text-gray-900">{count}</p>
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}
