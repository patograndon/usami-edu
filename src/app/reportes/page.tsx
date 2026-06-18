"use client";

import { useMemo, useState } from "react";
import { Download, BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { attendanceRecords, decreto170Records, getMonthlyAttendanceStats } from "@/data/mock";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { getCursoInformeName, getCursoDisplayName, NIVELES_LABELS } from "@/types";
import type { NivelEducativo } from "@/types";

const COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

export default function ReportesPage() {
  const { data: alumnos } = useStudents();
  const { data: cursos } = useCourses();
  const [selectedCurso, setSelectedCurso] = useState("");

  const matriculaPorCurso = useMemo(() =>
    cursos.filter((c) => c.activo).map((c) => ({
      name: getCursoDisplayName(c),
      alumnos: alumnos.filter((a) => a.cursoId === c.id && a.activo).length,
      capacidad: c.capacidad,
    })),
    []
  );

  const distribucionNivel = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of alumnos.filter((a) => a.activo)) {
      const label = NIVELES_LABELS[a.nivel] || a.nivel;
      counts[label] = (counts[label] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const pendientesD170 = useMemo(() => {
    const ref = new Date("2026-06-17");
    return decreto170Records.filter((r) => {
      const venc = new Date(r.fechaVencimientoReevaluacion);
      const dias = Math.ceil((venc.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
      return dias <= 60;
    }).length;
  }, []);

  const asistenciaGeneral = useMemo(() => getMonthlyAttendanceStats(), []);

  const asistenciaPorCurso = useMemo(() =>
    cursos.filter((c) => c.activo).map((c) => {
      const stats = getMonthlyAttendanceStats(c.id);
      return { name: getCursoDisplayName(c), porcentaje: stats.percentage, presentes: stats.present, ausentes: stats.absent };
    }),
    []
  );

  const cursoStats = selectedCurso ? getMonthlyAttendanceStats(selectedCurso) : null;
  const cursoObj = selectedCurso ? cursos.find((c) => c.id === selectedCurso) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-sm text-gray-500">
            {alumnos.filter((a) => a.activo).length} alumnos activos · Junio 2026
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" /> Exportar PDF
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Matriculados" value={alumnos.filter((a) => a.activo).length} color="primary" />
        <StatCard label="Cursos Activos" value={cursos.filter((c) => c.activo).length} color="emerald" />
        <StatCard label="Asistencia Promedio" value={`${asistenciaGeneral.percentage}%`} color="blue" />
        <StatCard label="Pendientes D170" value={pendientesD170} color={pendientesD170 > 0 ? "red" : "emerald"} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900">Matrícula por Curso</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matriculaPorCurso} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(value) => [String(value)]}
                />
                <Bar dataKey="alumnos" fill="#6366f1" radius={[4, 4, 0, 0]} name="alumnos" />
                <Bar dataKey="capacidad" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="capacidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-semibold text-gray-900">Distribución por Nivel</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribucionNivel} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {distribucionNivel.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-gray-900">Asistencia por Curso — Junio 2026</h2>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={asistenciaPorCurso} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(value) => [`${value}%`]}
              />
              <Bar dataKey="porcentaje" radius={[4, 4, 0, 0]}>
                {asistenciaPorCurso.map((entry, i) => (
                  <Cell key={i} fill={entry.porcentaje >= 85 ? "#22c55e" : entry.porcentaje >= 75 ? "#f59e0b" : "#ef4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Fórmula: (Días Presente / Días Hábiles Totales) × 100.
          Verde ≥85% · Amarillo ≥75% · Rojo &lt;75%
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Reporte Mensual por Curso</h2>
        <div className="flex items-center gap-3 mb-4">
          <select value={selectedCurso} onChange={(e) => setSelectedCurso(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Seleccionar curso...</option>
            {cursos.filter((c) => c.activo).map((c) => (
              <option key={c.id} value={c.id}>{getCursoInformeName(c)}</option>
            ))}
          </select>
          {cursoStats && (
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4" /> Descargar Reporte
            </button>
          )}
        </div>
        {cursoStats && cursoObj ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{cursoStats.total}</p>
              <p className="text-xs text-gray-500">Registros totales</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-700">{cursoStats.present}</p>
              <p className="text-xs text-emerald-600">Presentes</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-3xl font-bold text-red-700">{cursoStats.absent}</p>
              <p className="text-xs text-red-600">Ausentes</p>
            </div>
            <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-center">
              <p className={`text-3xl font-bold ${cursoStats.percentage >= 85 ? "text-emerald-700" : cursoStats.percentage >= 75 ? "text-amber-700" : "text-red-700"}`}>
                {cursoStats.percentage}%
              </p>
              <p className="text-xs text-primary-600">Asistencia</p>
            </div>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-gray-500">Seleccione un curso para ver su reporte mensual</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  const colorMap: Record<string, string> = {
    primary: "border-primary-200 bg-primary-50 text-primary-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    red: "border-red-200 bg-red-50 text-red-700",
  };
  return (
    <div className={`rounded-xl border p-4 text-center ${colorMap[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}
