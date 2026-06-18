"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, Shield, Clock, AlertTriangle } from "lucide-react";
import { attendanceRecords, decreto170Records } from "@/data/mock";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { MINEDUC_REPORT_LABELS, getCursoInformeName } from "@/types";
import type { MINEDUCReportType } from "@/types";

const REPORTS: { type: MINEDUCReportType; description: string; format: string }[] = [
  { type: "asistencia", description: "Registro mensual de asistencia por curso en formato SIGE. Incluye RUT, nombre, días presentes/ausentes y porcentaje.", format: ".xlsx" },
  { type: "matricula", description: "Declaración oficial de matrícula con datos completos de cada alumno: RUT, nombre, fecha nacimiento, nivel, apoderado.", format: ".csv" },
  { type: "decreto170", description: "Informe de alumnos PIE con diagnóstico CIE-10, fecha de evaluación, reevaluación y sesiones realizadas.", format: ".xlsx" },
  { type: "personal", description: "Dotación docente del establecimiento: RUT, nombre, cargo, fecha ingreso, horas contrato.", format: ".csv" },
];

export default function MINEDUCPage() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();
  const { data: alumnos } = useStudents();
  const { data: cursos } = useCourses();
  const { data: usuarios } = useUsers();
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);

  if (!hasPermission("mineduc.exportar")) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Shield className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">Solo Director y Sostenedor pueden exportar reportes MINEDUC.</p>
      </div>
    );
  }

  function handleGenerate(type: MINEDUCReportType) {
    setGenerating(type);
    setTimeout(() => {
      setGenerating(null);
      setGenerated([...generated, type]);
    }, 1500);
  }

  const stats = {
    alumnos: alumnos.filter((a) => a.activo).length,
    cursos: cursos.filter((c) => c.activo).length,
    registrosAsistencia: attendanceRecords.length,
    alumnosD170: decreto170Records.length,
    personal: usuarios.filter((u) => u.tenantId === tenant.id && u.isActive && u.role !== "security_gate").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportabilidad MINEDUC</h1>
        <p className="text-sm text-gray-500">Exportación en formato oficial del Ministerio de Educación de Chile</p>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Información importante</p>
            <p className="text-xs text-blue-700 mt-1">
              Cada descarga queda registrada en el log de auditoría con: usuario, fecha, hora y tipo de reporte.
              Los archivos generados cumplen con la estructura técnica oficial del SIGE-MINEDUC.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.alumnos}</p>
          <p className="text-xs text-gray-500">Alumnos activos</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.cursos}</p>
          <p className="text-xs text-gray-500">Cursos</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.registrosAsistencia}</p>
          <p className="text-xs text-gray-500">Registros asistencia</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.alumnosD170}</p>
          <p className="text-xs text-gray-500">Alumnos PIE/D170</p>
        </div>
      </div>

      <div className="space-y-4">
        {REPORTS.map((report) => {
          const isGenerating = generating === report.type;
          const isGenerated = generated.includes(report.type);
          return (
            <div key={report.type} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{MINEDUC_REPORT_LABELS[report.type]}</h3>
                    <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                    <p className="mt-1 text-xs text-gray-400">Formato: {report.format} · Establecimiento: {tenant.nombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isGenerated && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Listo</span>
                  )}
                  <button onClick={() => handleGenerate(report.type)} disabled={isGenerating}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                      isGenerating
                        ? "bg-gray-100 text-gray-400 cursor-wait"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
                    }`}>
                    {isGenerating ? (
                      <><Clock className="h-4 w-4 animate-spin" /> Generando...</>
                    ) : (
                      <><Download className="h-4 w-4" /> Exportar {report.format}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs text-gray-400">
          Generando como: {currentUser.nombreCompleto} ({currentUser.role}) · tenant_id: {tenant.id} ·
          Todas las descargas quedan registradas en el AuditLog
        </p>
      </div>
    </div>
  );
}
