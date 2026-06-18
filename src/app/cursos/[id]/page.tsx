"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft, Users, ClipboardCheck, NotebookPen, Wifi,
  Check, X, Clock, FileCheck,
} from "lucide-react";
import { attendanceRecords, dailyLogEntries, alumnos as mockAlumnos } from "@/data/mock";
import { useCourseById } from "@/hooks/useCourses";
import { useStudents } from "@/hooks/useStudents";
import {
  getCursoDisplayName, NIVELES_LABELS,
  ATTENDANCE_LABELS, DAILY_LOG_CATEGORY_LABELS,
} from "@/types";
import type { AttendanceStatus } from "@/types";

const STATUS_STYLES: Record<AttendanceStatus, { bg: string; text: string }> = {
  present: { bg: "bg-emerald-100", text: "text-emerald-700" },
  absent: { bg: "bg-red-100", text: "text-red-700" },
  excused: { bg: "bg-amber-100", text: "text-amber-700" },
  late: { bg: "bg-blue-100", text: "text-blue-700" },
};

export default function CursoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: curso, loading, isFromApi } = useCourseById(id);
  const { data: allStudents } = useStudents();

  const alumnosCurso = useMemo(
    () => allStudents.filter((a) => a.cursoId === id && a.activo),
    [allStudents, id]
  );

  const todayAttendance = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const map = new Map<string, AttendanceStatus>();
    attendanceRecords
      .filter((r) => r.cursoId === id && r.date === today)
      .forEach((r) => map.set(r.studentId, r.status));
    return map;
  }, [id]);

  const recentObservations = useMemo(
    () => dailyLogEntries
      .filter((e) => e.cursoId === id)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 8),
    [id]
  );

  const attendanceStats = useMemo(() => {
    let present = 0, absent = 0, excused = 0, late = 0, pending = 0;
    for (const a of alumnosCurso) {
      const s = todayAttendance.get(a.id);
      if (!s) pending++;
      else if (s === "present") present++;
      else if (s === "absent") absent++;
      else if (s === "excused") excused++;
      else if (s === "late") late++;
    }
    return { present, absent, excused, late, pending };
  }, [alumnosCurso, todayAttendance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-gray-500">Curso no encontrado</p>
        <Link href="/cursos" className="mt-4 text-primary-600 hover:text-primary-700">Volver a Cursos</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cursos"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {getCursoDisplayName(curso)}
            {isFromApi && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-emerald-600">
                <Wifi className="h-3 w-3" /> API
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500">
            {NIVELES_LABELS[curso.officialLevel]} · Educadora: {curso.educadoraTitular} · {alumnosCurso.length}/{curso.capacidad} alumnos
          </p>
        </div>
        <Link href={`/asistencia?curso=${curso.id}`}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
          <ClipboardCheck className="h-4 w-4" /> Tomar Asistencia
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{attendanceStats.present}</p>
          <p className="text-xs text-emerald-600">Presentes</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{attendanceStats.absent}</p>
          <p className="text-xs text-red-600">Ausentes</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{attendanceStats.excused}</p>
          <p className="text-xs text-amber-600">Justificados</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{attendanceStats.late}</p>
          <p className="text-xs text-blue-600">Atrasados</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
          <p className="text-2xl font-bold text-gray-600">{attendanceStats.pending}</p>
          <p className="text-xs text-gray-500">Pendientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-500" />
              <h2 className="text-base font-bold text-gray-900">Alumnos ({alumnosCurso.length})</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {alumnosCurso.map((alumno) => {
              const status = todayAttendance.get(alumno.id);
              const hasAlerts = alumno.salud.alergias.length > 0 || alumno.salud.medicamentos.length > 0;
              return (
                <div key={alumno.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                    {alumno.nombres[0]}{alumno.apellidoPaterno[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/alumnos/${alumno.id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600">
                      {alumno.nombres} {alumno.apellidoPaterno}
                    </Link>
                    <p className="text-xs text-gray-500">{alumno.rut}</p>
                  </div>
                  {hasAlerts && (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">Alerta</span>
                  )}
                  {status ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status].bg} ${STATUS_STYLES[status].text}`}>
                      {ATTENDANCE_LABELS[status]}
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Sin registro</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <NotebookPen className="h-5 w-5 text-violet-500" />
              <h2 className="text-base font-bold text-gray-900">Últimas Observaciones</h2>
            </div>
            <Link href="/diario" className="text-xs font-medium text-primary-600 hover:text-primary-700">Ver todo</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentObservations.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500">Sin observaciones recientes</p>
            ) : (
              recentObservations.map((entry) => {
                const alumno = allStudents.find((a) => a.id === entry.studentId)
                  || mockAlumnos.find((a) => a.id === entry.studentId);
                const detalle =
                  entry.comida ? `Comida: ${entry.comida.cantidad}` :
                  entry.siesta ? `Siesta: ${entry.siesta.calidad}` :
                  entry.higiene ? `Higiene: ${entry.higiene.tipo}` :
                  entry.actividad ? entry.actividad.descripcion :
                  entry.observacion ? entry.observacion.texto : "";
                return (
                  <div key={entry.id} className="px-5 py-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : entry.studentId}
                      </p>
                      <span className="text-xs text-gray-400">{entry.timestamp.split("T")[1]?.substring(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                        {DAILY_LOG_CATEGORY_LABELS[entry.category]}
                      </span>
                      <p className="text-xs text-gray-500 truncate">{detalle}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
