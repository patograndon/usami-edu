"use client";

import { useState, useMemo, useRef } from "react";
import {
  FileText,
  Printer,
  Lock,
  Save,
  User,
  Building2,
  Stethoscope,
  Shield,
} from "lucide-react";
import { decreto170Records, fueiRecords } from "@/data/mock";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import {
  NIVELES_LABELS, NEE_LABELS, getCursoInformeName,
  calcularFechaReevaluacion,
} from "@/types";
import type { FueiRecord, NeeType } from "@/types";

export default function FueiPage() {
  const { currentUser } = useAuth();
  const { tenant } = useTenant();
  const { data: alumnos } = useStudents();
  const { data: cursos } = useCourses();
  const printRef = useRef<HTMLDivElement>(null);

  const alumnosD170 = useMemo(
    () => decreto170Records.map((r) => ({
      record: r,
      alumno: alumnos.find((a) => a.id === r.studentId),
    })).filter((x) => x.alumno),
    []
  );

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [localFueis, setLocalFueis] = useState<FueiRecord[]>(fueiRecords);

  const selectedAlumno = alumnos.find((a) => a.id === selectedStudentId);
  const selectedD170 = decreto170Records.find((r) => r.studentId === selectedStudentId);
  const existingFuei = localFueis.find((f) => f.studentId === selectedStudentId);
  const selectedCurso = selectedAlumno?.cursoId
    ? cursos.find((c) => c.id === selectedAlumno.cursoId)
    : null;
  const apoderado = selectedAlumno?.apoderados.find((a) => a.esTitular);

  const [form, setForm] = useState({
    neeType: "transitoria" as NeeType,
    diagnosticoCie10: "",
    diagnosticoDescripcion: "",
    fechaDeteccion: "",
    profesionalEvaluador: "",
    rutProfesional: "",
    especialidadProfesional: "",
    apoyos: "",
    recursosAdicionales: "",
    adecuacionesCurriculares: "",
    fechaIngresoPie: "",
  });

  function autoFillFromStudent() {
    if (!selectedD170) return;
    setForm({
      neeType: selectedD170.neeType,
      diagnosticoCie10: selectedD170.diagnosticoCie10,
      diagnosticoDescripcion: selectedD170.diagnosticoDescripcion,
      fechaDeteccion: selectedD170.fechaEvaluacion,
      profesionalEvaluador: selectedD170.profesionalEvaluador,
      rutProfesional: "",
      especialidadProfesional: "",
      apoyos: "Fonoaudiología (2 sesiones/semana)",
      recursosAdicionales: "",
      adecuacionesCurriculares: "",
      fechaIngresoPie: selectedD170.fechaIngresoPie,
    });
  }

  function handleSelectStudent(id: string) {
    setSelectedStudentId(id);
    const d170 = decreto170Records.find((r) => r.studentId === id);
    if (d170) {
      setForm({
        neeType: d170.neeType,
        diagnosticoCie10: d170.diagnosticoCie10,
        diagnosticoDescripcion: d170.diagnosticoDescripcion,
        fechaDeteccion: d170.fechaEvaluacion,
        profesionalEvaluador: d170.profesionalEvaluador,
        rutProfesional: "",
        especialidadProfesional: "",
        apoyos: "Fonoaudiología (2 sesiones/semana)",
        recursosAdicionales: "",
        adecuacionesCurriculares: "",
        fechaIngresoPie: d170.fechaIngresoPie,
      });
    }
  }

  function handleSaveFuei() {
    if (!selectedAlumno || !selectedD170) return;
    const fuei: FueiRecord = {
      id: `fuei-${Date.now()}`,
      tenantId: tenant.id,
      studentId: selectedAlumno.id,
      anio: 2026,
      rbd: tenant.rbd,
      nombreEstablecimiento: tenant.nombre,
      regionEstablecimiento: tenant.region,
      comunaEstablecimiento: tenant.comuna,
      rutAlumno: selectedAlumno.rut,
      nombreAlumno: `${selectedAlumno.nombres} ${selectedAlumno.apellidoPaterno} ${selectedAlumno.apellidoMaterno}`,
      fechaNacimientoAlumno: selectedAlumno.fechaNacimiento,
      generoAlumno: selectedAlumno.genero === "masculino" ? "Masculino" : selectedAlumno.genero === "femenino" ? "Femenino" : "Otro",
      nivelAlumno: NIVELES_LABELS[selectedAlumno.nivel],
      cursoAlumno: selectedCurso ? getCursoInformeName(selectedCurso) : NIVELES_LABELS[selectedAlumno.nivel],
      neeType: form.neeType,
      diagnosticoCie10: form.diagnosticoCie10,
      diagnosticoDescripcion: form.diagnosticoDescripcion,
      fechaDeteccion: form.fechaDeteccion,
      profesionalEvaluador: form.profesionalEvaluador,
      rutProfesional: form.rutProfesional,
      especialidadProfesional: form.especialidadProfesional,
      apoyosEspecializados: form.apoyos.split(",").map((s) => s.trim()).filter(Boolean),
      recursosAdicionales: form.recursosAdicionales,
      adecuacionesCurriculares: form.adecuacionesCurriculares,
      fechaIngresoPie: form.fechaIngresoPie,
      fechaReevaluacion: calcularFechaReevaluacion(form.fechaIngresoPie),
      nombreApoderado: apoderado ? `${apoderado.nombres} ${apoderado.apellidoPaterno} ${apoderado.apellidoMaterno}` : "",
      rutApoderado: apoderado?.rut || "",
      firmaApoderado: false,
      locked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalFueis([fuei, ...localFueis]);
  }

  function handlePrint() {
    window.print();
  }

  const fueiToShow = existingFuei;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FUEI — Formulario Único de Evaluación Integral</h1>
          <p className="text-sm text-gray-500">Decreto 170 · Ministerio de Educación</p>
        </div>
      </div>

      <div className="print:hidden">
        <label className="mb-1 block text-sm font-medium text-gray-700">Seleccionar Alumno D170</label>
        <select
          value={selectedStudentId}
          onChange={(e) => handleSelectStudent(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          <option value="">Seleccionar alumno...</option>
          {alumnosD170.map(({ record, alumno }) => (
            <option key={record.id} value={record.studentId}>
              {alumno!.nombres} {alumno!.apellidoPaterno} — {record.diagnosticoCie10}
            </option>
          ))}
        </select>
      </div>

      {selectedAlumno && !fueiToShow && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-6 space-y-6 print:hidden">
          <h2 className="text-lg font-bold text-violet-900">Crear FUEI para {selectedAlumno.nombres} {selectedAlumno.apellidoPaterno}</h2>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <User className="h-4 w-4" /> Datos Autocompletados desde Ficha del Alumno
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <AutoField label="RUT" value={selectedAlumno.rut} />
              <AutoField label="Nombre" value={`${selectedAlumno.nombres} ${selectedAlumno.apellidoPaterno} ${selectedAlumno.apellidoMaterno}`} />
              <AutoField label="Fecha Nac." value={selectedAlumno.fechaNacimiento} />
              <AutoField label="Nivel" value={NIVELES_LABELS[selectedAlumno.nivel]} />
              <AutoField label="Curso" value={selectedCurso ? getCursoInformeName(selectedCurso) : "—"} />
              <AutoField label="Apoderado" value={apoderado ? `${apoderado.nombres} ${apoderado.apellidoPaterno}` : "—"} />
              <AutoField label="RUT Apoderado" value={apoderado?.rut || "—"} />
              <AutoField label="Establecimiento" value={tenant.nombre} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tipo NEE *</label>
              <select value={form.neeType} onChange={(e) => setForm({ ...form, neeType: e.target.value as NeeType })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500">
                <option value="transitoria">{NEE_LABELS.transitoria}</option>
                <option value="permanente">{NEE_LABELS.permanente}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Diagnóstico CIE-10 *</label>
              <input type="text" value={form.diagnosticoCie10} onChange={(e) => setForm({ ...form, diagnosticoCie10: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-mono focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Descripción del Diagnóstico *</label>
              <input type="text" value={form.diagnosticoDescripcion} onChange={(e) => setForm({ ...form, diagnosticoDescripcion: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de Detección *</label>
              <input type="date" value={form.fechaDeteccion} onChange={(e) => setForm({ ...form, fechaDeteccion: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fecha Ingreso PIE *</label>
              <input type="date" value={form.fechaIngresoPie} onChange={(e) => setForm({ ...form, fechaIngresoPie: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
              {form.fechaIngresoPie && (
                <p className="mt-1 text-xs text-violet-600">
                  Reevaluación automática: <strong>{calcularFechaReevaluacion(form.fechaIngresoPie)}</strong> (ingreso + 12 meses)
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Profesional Evaluador *</label>
              <input type="text" value={form.profesionalEvaluador} onChange={(e) => setForm({ ...form, profesionalEvaluador: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">RUT Profesional</label>
              <input type="text" value={form.rutProfesional} onChange={(e) => setForm({ ...form, rutProfesional: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Apoyos Especializados (separados por coma)</label>
              <input type="text" value={form.apoyos} onChange={(e) => setForm({ ...form, apoyos: e.target.value })}
                placeholder="Ej: Fonoaudiología (2 ses/sem), Psicología (1 ses/sem)"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Adecuaciones Curriculares</label>
              <textarea value={form.adecuacionesCurriculares} onChange={(e) => setForm({ ...form, adecuacionesCurriculares: e.target.value })} rows={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm resize-none focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={handleSaveFuei}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700">
              <Save className="h-4 w-4" /> Guardar FUEI
            </button>
          </div>
        </div>
      )}

      {fueiToShow && (
        <>
          <div className="flex gap-3 print:hidden">
            <button onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-900">
              <Printer className="h-4 w-4" /> Exportar PDF / Imprimir
            </button>
            {fueiToShow.locked && (
              <span className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500">
                <Lock className="h-3.5 w-3.5" /> Documento bloqueado — Inalterable
              </span>
            )}
          </div>

          <div ref={printRef} className="rounded-xl border border-gray-300 bg-white p-8 print:border-0 print:p-0 print:shadow-none">
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest">República de Chile · Ministerio de Educación</p>
                <h2 className="text-xl font-bold text-gray-900 mt-1">FORMULARIO ÚNICO DE EVALUACIÓN INTEGRAL (FUEI)</h2>
                <p className="text-sm text-gray-600">Decreto N° 170/2009 — Programa de Integración Escolar</p>
              </div>
            </div>

            <FueiSection title="I. IDENTIFICACIÓN DEL ESTABLECIMIENTO" icon={Building2}>
              <FueiRow label="Nombre" value={fueiToShow.nombreEstablecimiento} />
              <FueiRow label="RBD" value={fueiToShow.rbd} />
              <FueiRow label="Región" value={fueiToShow.regionEstablecimiento} />
              <FueiRow label="Comuna" value={fueiToShow.comunaEstablecimiento} />
            </FueiSection>

            <FueiSection title="II. IDENTIFICACIÓN DEL ALUMNO/A" icon={User}>
              <FueiRow label="Nombre completo" value={fueiToShow.nombreAlumno} />
              <FueiRow label="RUT" value={fueiToShow.rutAlumno} />
              <FueiRow label="Fecha de nacimiento" value={fueiToShow.fechaNacimientoAlumno} />
              <FueiRow label="Género" value={fueiToShow.generoAlumno} />
              <FueiRow label="Nivel" value={fueiToShow.nivelAlumno} />
              <FueiRow label="Curso" value={fueiToShow.cursoAlumno} />
            </FueiSection>

            <FueiSection title="III. DIAGNÓSTICO" icon={Stethoscope}>
              <FueiRow label="Tipo de NEE" value={NEE_LABELS[fueiToShow.neeType]} />
              <FueiRow label="Código CIE-10" value={fueiToShow.diagnosticoCie10} mono />
              <FueiRow label="Diagnóstico" value={fueiToShow.diagnosticoDescripcion} />
              <FueiRow label="Fecha de detección" value={fueiToShow.fechaDeteccion} />
              <FueiRow label="Profesional evaluador" value={fueiToShow.profesionalEvaluador} />
              <FueiRow label="RUT profesional" value={fueiToShow.rutProfesional} />
              <FueiRow label="Especialidad" value={fueiToShow.especialidadProfesional} />
            </FueiSection>

            <FueiSection title="IV. PLAN DE APOYO" icon={Shield}>
              <div className="col-span-full">
                <p className="text-xs font-medium text-gray-500 mb-1">Apoyos especializados</p>
                <ul className="list-disc list-inside text-sm text-gray-900">
                  {fueiToShow.apoyosEspecializados.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              {fueiToShow.adecuacionesCurriculares && (
                <FueiRow label="Adecuaciones curriculares" value={fueiToShow.adecuacionesCurriculares} full />
              )}
              {fueiToShow.recursosAdicionales && (
                <FueiRow label="Recursos adicionales" value={fueiToShow.recursosAdicionales} full />
              )}
            </FueiSection>

            <div className="mt-6 grid grid-cols-2 gap-6 border-t-2 border-gray-800 pt-6">
              <div>
                <FueiRow label="Fecha ingreso PIE" value={fueiToShow.fechaIngresoPie} />
                <FueiRow label="Fecha reevaluación" value={fueiToShow.fechaReevaluacion} />
              </div>
              <div>
                <FueiRow label="Apoderado" value={fueiToShow.nombreApoderado} />
                <FueiRow label="RUT Apoderado" value={fueiToShow.rutApoderado} />
                <div className="mt-8 border-t border-gray-400 pt-2 text-center">
                  <p className="text-xs text-gray-500">Firma Apoderado/Tutor</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedStudentId && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center print:hidden">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-gray-500">Seleccione un alumno para ver o crear su FUEI</p>
        </div>
      )}
    </div>
  );
}

function AutoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-emerald-200 bg-white px-3 py-2">
      <p className="text-xs text-emerald-600">{label}</p>
      <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
    </div>
  );
}

function FueiSection({ title, icon: Icon, children }: { title: string; icon: typeof Building2; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
        <Icon className="h-4 w-4 text-gray-500 print:hidden" />
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">{children}</div>
    </div>
  );
}

function FueiRow({ label, value, mono, full }: { label: string; value: string; mono?: boolean; full?: boolean }) {
  return (
    <div className={full ? "col-span-full" : ""}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm font-medium text-gray-900 ${mono ? "font-mono" : ""}`}>{value || "—"}</p>
    </div>
  );
}
