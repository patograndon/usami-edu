"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  X,
  Clock,
  FileCheck,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { attendanceRecords } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { useClientDate } from "@/hooks/useClientDate";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { getCursoInformeName } from "@/types";
import type { AttendanceStatus, AttendanceRecord } from "@/types";

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; color: string; bg: string; icon: typeof Check }
> = {
  present: { label: "Presente", color: "text-emerald-700", bg: "bg-emerald-100 border-emerald-300", icon: Check },
  absent: { label: "Ausente", color: "text-red-700", bg: "bg-red-100 border-red-300", icon: X },
  excused: { label: "Justificado", color: "text-amber-700", bg: "bg-amber-100 border-amber-300", icon: FileCheck },
  late: { label: "Atrasado", color: "text-blue-700", bg: "bg-blue-100 border-blue-300", icon: Clock },
};

export default function AsistenciaPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>}>
      <AsistenciaPage />
    </Suspense>
  );
}

function AsistenciaPage() {
  const { currentUser } = useAuth();
  const { tenant } = useTenant();
  const searchParams = useSearchParams();
  const { data: cursos } = useCourses();
  const { data: alumnos } = useStudents();
  const cursoFromUrl = searchParams.get("curso");
  const initialCurso = cursoFromUrl && cursos.some((c) => c.id === cursoFromUrl)
    ? cursoFromUrl
    : cursos[0]?.id || "";
  const [selectedCurso, setSelectedCurso] = useState(initialCurso);
  const { todayStr: today, todayLabel } = useClientDate();

  const alumnosCurso = useMemo(
    () => alumnos.filter((a) => a.cursoId === selectedCurso && a.activo),
    [alumnos, selectedCurso]
  );

  const existingRecords = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendanceRecords
      .filter((r) => r.cursoId === selectedCurso && r.date === today)
      .forEach((r) => map.set(r.studentId, r));
    return map;
  }, [selectedCurso, today]);

  const [localRecords, setLocalRecords] = useState<Map<string, AttendanceStatus>>(
    () => {
      const m = new Map<string, AttendanceStatus>();
      existingRecords.forEach((r, id) => m.set(id, r.status));
      return m;
    }
  );

  function markStatus(studentId: string, status: AttendanceStatus) {
    setLocalRecords((prev) => {
      const next = new Map(prev);
      next.set(studentId, status);
      return next;
    });
  }

  const stats = useMemo(() => {
    let present = 0, absent = 0, excused = 0, late = 0, pending = 0;
    for (const a of alumnosCurso) {
      const s = localRecords.get(a.id);
      if (!s) pending++;
      else if (s === "present") present++;
      else if (s === "absent") absent++;
      else if (s === "excused") excused++;
      else if (s === "late") late++;
    }
    return { present, absent, excused, late, pending, total: alumnosCurso.length };
  }, [alumnosCurso, localRecords]);

  const cursoObj = cursos.find((c) => c.id === selectedCurso);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
          <p className="mt-1 text-sm text-gray-500 capitalize">{todayLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedCurso}
            onChange={(e) => {
              setSelectedCurso(e.target.value);
              setLocalRecords(new Map());
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {cursos.filter((c) => c.activo).map((c) => (
              <option key={c.id} value={c.id}>{getCursoInformeName(c)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Presentes" value={stats.present} total={stats.total} color="emerald" />
        <StatCard label="Ausentes" value={stats.absent} total={stats.total} color="red" />
        <StatCard label="Justificados" value={stats.excused} total={stats.total} color="amber" />
        <StatCard label="Atrasados" value={stats.late} total={stats.total} color="blue" />
        <StatCard label="Pendientes" value={stats.pending} total={stats.total} color="gray" />
      </div>

      {cursoObj && (
        <p className="text-sm text-gray-500">
          Educadora: <span className="font-medium text-gray-700">{cursoObj.educadoraTitular}</span>
          {" · "}Registrando como: <span className="font-medium text-primary-600">{currentUser.nombreCompleto}</span>
        </p>
      )}

      <div className="space-y-2">
        {alumnosCurso.map((alumno) => {
          const currentStatus = localRecords.get(alumno.id);
          return (
            <div
              key={alumno.id}
              className={`flex flex-col gap-3 rounded-xl border bg-white p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                currentStatus
                  ? `border-l-4 ${STATUS_CONFIG[currentStatus].bg.split(" ")[1] || "border-gray-200"}`
                  : "border-gray-200 border-l-4 border-l-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                  {alumno.nombres[0]}{alumno.apellidoPaterno[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {alumno.nombres} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
                  </p>
                  <p className="text-xs text-gray-500">{alumno.rut}</p>
                </div>
                {currentStatus && (
                  <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CONFIG[currentStatus].bg} ${STATUS_CONFIG[currentStatus].color}`}>
                    {STATUS_CONFIG[currentStatus].label}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-2">
                <AttendanceButton
                  status="present"
                  active={currentStatus === "present"}
                  onClick={() => markStatus(alumno.id, "present")}
                />
                <AttendanceButton
                  status="absent"
                  active={currentStatus === "absent"}
                  onClick={() => markStatus(alumno.id, "absent")}
                />
                <AttendanceButton
                  status="late"
                  active={currentStatus === "late"}
                  onClick={() => markStatus(alumno.id, "late")}
                />
                <AttendanceButton
                  status="excused"
                  active={currentStatus === "excused"}
                  onClick={() => markStatus(alumno.id, "excused")}
                />
              </div>
            </div>
          );
        })}
      </div>

      {alumnosCurso.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No hay alumnos asignados a este curso</p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-400">
          tenant_id: {tenant.id} · Registros auditables con usuario y hora
        </p>
        <button
          disabled={stats.pending > 0}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar Asistencia ({stats.total - stats.pending}/{stats.total})
        </button>
      </div>
    </div>
  );
}

function AttendanceButton({
  status,
  active,
  onClick,
}: {
  status: AttendanceStatus;
  active: boolean;
  onClick: () => void;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-3 text-sm font-medium transition-all active:scale-95 sm:px-4 sm:py-2.5 ${
        active
          ? `${config.bg} ${config.color} ring-2 ring-offset-1`
          : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
      }`}
    >
      <Icon className="h-5 w-5 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">{config.label}</span>
    </button>
  );
}

function StatCard({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    red: "bg-red-50 border-red-200 text-red-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    gray: "bg-gray-50 border-gray-200 text-gray-600",
  };
  return (
    <div className={`rounded-xl border p-3 text-center ${colorMap[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}
