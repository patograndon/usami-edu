"use client";

import { useMemo } from "react";
import { Calendar, TrendingDown, CalendarDays, TrendingUp, Cake, AlertTriangle, Pill, Wifi } from "lucide-react";
import Link from "next/link";
import KpiGrid from "@/components/dashboard/KpiGrid";
import SetupWizard from "@/components/dashboard/SetupWizard";
import {
  kpiData, getAttendanceAlerts,
  getUpcomingEvents, getMonthlyAttendanceStats,
} from "@/data/mock";
import { getCursoInformeName, getCursoDisplayName, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from "@/types";
import { useClientDate } from "@/hooks/useClientDate";
import { useSetupStatus } from "@/hooks/useSetupStatus";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import type { Alumno } from "@/types";

function getCumpleaneros(alumnos: Alumno[]) {
  const now = new Date();
  const hoy = { month: now.getMonth() + 1, day: now.getDate() };
  const proximos: { alumno: Alumno; dias: number; edad: number }[] = [];
  for (const a of alumnos.filter((a) => a.activo)) {
    const [y, m, d] = a.fechaNacimiento.split("-").map(Number);
    let diaDelAnio = (m - 1) * 30 + d;
    let hoyDelAnio = (hoy.month - 1) * 30 + hoy.day;
    let diff = diaDelAnio - hoyDelAnio;
    if (diff < 0) diff += 365;
    if (diff <= 7) {
      proximos.push({ alumno: a, dias: diff, edad: new Date().getFullYear() - y });
    }
  }
  return proximos.sort((a, b) => a.dias - b.dias);
}

export default function DashboardPage() {
  const { todayLabel } = useClientDate();
  const { data: alumnos, isFromApi: alumnosFromApi } = useStudents();
  const { data: cursos, isFromApi: cursosFromApi } = useCourses();
  const setupStatus = useSetupStatus(cursos, alumnos);

  const isFromApi = alumnosFromApi || cursosFromApi;

  const alumnosPorCurso = useMemo(() => cursos.map((curso) => ({
    curso,
    cantidad: alumnos.filter((a) => a.cursoId === curso.id).length,
  })), [cursos, alumnos]);

  const alertasMedicas = useMemo(() => alumnos.filter(
    (a) =>
      a.salud.alergias.length > 0 ||
      a.salud.enfermedadesCronicas.length > 0 ||
      !a.salud.vacunasAlDia
  ), [alumnos]);

  const alumnosConMedicamentos = useMemo(() => alumnos.filter(
    (a) => a.activo && a.salud.medicamentos.length > 0
  ), [alumnos]);

  const cumpleaneros = getCumpleaneros(alumnos);

  const alertasAsistencia = getAttendanceAlerts();
  const upcomingEvents = getUpcomingEvents(4);
  const monthStats = getMonthlyAttendanceStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panel del Director
          {isFromApi && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-emerald-600">
              <Wifi className="h-3 w-3" /> API
            </span>
          )}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span className="capitalize">{todayLabel}</span>
        </div>
      </div>

      <SetupWizard status={setupStatus} />

      <KpiGrid data={kpiData} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-gray-900">Próximos Eventos</h2>
            </div>
            <Link href="/calendario" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Ver calendario
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">Sin eventos próximos</p>
          ) : (
            <div className="space-y-2.5">
              {upcomingEvents.map((evt) => {
                const curso = evt.cursoId ? cursos.find((c) => c.id === evt.cursoId) : null;
                return (
                  <div key={evt.id} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="flex flex-col items-center shrink-0 w-12">
                      <span className="text-xs text-gray-500">
                        {new Date(evt.startDate + "T12:00:00").toLocaleDateString("es-CL", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {new Date(evt.startDate + "T12:00:00").getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{evt.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${EVENT_TYPE_COLORS[evt.type]}`} />
                        <span className="text-xs text-gray-500">{EVENT_TYPE_LABELS[evt.type]}</span>
                        {curso && <span className="text-xs text-primary-600">{getCursoDisplayName(curso)}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-gray-900">Asistencia del Mes</h2>
            </div>
            <Link href="/reportes" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Ver reportes
            </Link>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={monthStats.percentage >= 85 ? "#22c55e" : monthStats.percentage >= 75 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(monthStats.percentage / 100) * 314} 314`}
                />
              </svg>
              <div className="absolute text-center">
                <p className={`text-2xl font-bold ${monthStats.percentage >= 85 ? "text-emerald-700" : monthStats.percentage >= 75 ? "text-amber-700" : "text-red-700"}`}>
                  {monthStats.percentage}%
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-center">
              <p className="text-lg font-bold text-emerald-700">{monthStats.present}</p>
              <p className="text-xs text-emerald-600">Presentes</p>
            </div>
            <div className="rounded-lg bg-red-50 p-2 text-center">
              <p className="text-lg font-bold text-red-700">{monthStats.absent}</p>
              <p className="text-xs text-red-600">Ausentes</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2 text-center">
              <p className="text-lg font-bold text-amber-700">{monthStats.excused}</p>
              <p className="text-xs text-amber-600">Justificados</p>
            </div>
          </div>
        </div>
      </div>

      {alertasAsistencia.length > 0 && (
        <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-bold text-orange-800">
              Alertas de Inasistencia ({alertasAsistencia.length})
            </h2>
          </div>
          <p className="mb-4 text-sm text-orange-700">
            Alumnos con 3+ ausencias consecutivas. Contactar apoderados para evitar pérdida de subvención.
          </p>
          <div className="space-y-2">
            {alertasAsistencia.map((alerta) => {
              const curso = cursos.find((c) => c.id === alerta.cursoId);
              return (
                <div key={alerta.studentId}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    alerta.type === "critical" ? "border-red-300 bg-red-50" : "border-orange-200 bg-orange-100"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                      alerta.type === "critical" ? "bg-red-200 text-red-700" : "bg-orange-200 text-orange-700"
                    }`}>
                      {alerta.consecutiveAbsences}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{alerta.studentName}</p>
                      <p className="text-xs text-gray-500">
                        {curso ? getCursoDisplayName(curso) : ""} · Última: {alerta.lastAbsenceDate}
                      </p>
                    </div>
                  </div>
                  <Link href={`/alumnos/${alerta.studentId}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700">Ver ficha</Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {cumpleaneros.length > 0 && (
          <div className="rounded-xl border border-pink-200 bg-pink-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cake className="h-5 w-5 text-pink-500" />
              <h2 className="text-base font-bold text-pink-800">Cumpleaños Esta Semana</h2>
            </div>
            <div className="space-y-2">
              {cumpleaneros.map(({ alumno, dias, edad }) => (
                <div key={alumno.id} className="flex items-center gap-3 rounded-lg bg-white border border-pink-100 p-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-200 text-pink-700 text-sm font-bold">
                    {alumno.nombres[0]}{alumno.apellidoPaterno[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{alumno.nombres} {alumno.apellidoPaterno}</p>
                    <p className="text-xs text-pink-600">
                      {dias === 0 ? "Hoy cumple" : `En ${dias} día${dias > 1 ? "s" : ""}`} · {edad} años
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alumnosConMedicamentos.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="h-5 w-5 text-blue-500" />
              <h2 className="text-base font-bold text-blue-800">Medicamentos Activos</h2>
            </div>
            <div className="space-y-2">
              {alumnosConMedicamentos.map((a) => (
                <div key={a.id} className="rounded-lg bg-white border border-blue-100 p-2.5">
                  <p className="text-sm font-medium text-gray-900">{a.nombres} {a.apellidoPaterno}</p>
                  {a.salud.medicamentos.map((med, i) => (
                    <p key={i} className="text-xs text-blue-700 mt-0.5">
                      {med.nombre} — {med.dosis} — {med.horaAdministracion}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {alertasMedicas.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-amber-800">Alergias Activas ({alertasMedicas.filter((a) => a.salud.alergias.length > 0).length})</h2>
            </div>
            <div className="space-y-2">
              {alertasMedicas.filter((a) => a.salud.alergias.length > 0).slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center gap-2 rounded-lg bg-white border border-amber-100 p-2.5">
                  <p className="text-sm font-medium text-gray-900 flex-1 truncate">{a.nombres} {a.apellidoPaterno}</p>
                  <div className="flex flex-wrap gap-1">
                    {a.salud.alergias.map((al) => (
                      <span key={al} className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">{al}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Alumnos por Curso</h2>
          <div className="space-y-3">
            {alumnosPorCurso.map(({ curso, cantidad }) => (
              <div key={curso.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{getCursoInformeName(curso)}</span>
                <div className="flex items-center gap-3 ml-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-primary-500" style={{ width: `${(cantidad / curso.capacidad) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold text-gray-900">{cantidad}/{curso.capacidad}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Enfermedades Crónicas y Vacunas</h2>
          {alumnos.filter((a) => a.salud.enfermedadesCronicas.length > 0 || !a.salud.vacunasAlDia).length === 0 ? (
            <p className="text-sm text-gray-500">Todos los alumnos al día</p>
          ) : (
            <div className="space-y-3">
              {alumnos.filter((a) => a.activo && (a.salud.enfermedadesCronicas.length > 0 || !a.salud.vacunasAlDia)).slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.nombres} {a.apellidoPaterno}</p>
                    <p className="text-xs text-gray-600">
                      {[
                        ...a.salud.enfermedadesCronicas,
                        ...(!a.salud.vacunasAlDia ? ["Vacunas pendientes"] : []),
                      ].join(" · ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
