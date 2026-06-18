"use client";

import { useState, useMemo } from "react";
import { Star, Plus, Save, X, Lock } from "lucide-react";
import { usuarios } from "@/data/mock";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { getCursoDisplayName, getCursoInformeName, NIVELES_LABELS } from "@/types";

interface Evaluacion {
  id: string;
  tenantId: string;
  studentId: string;
  cursoId: string;
  ambito: string;
  hito: string;
  nivel: number;
  observacion: string;
  fecha: string;
  evaluadorId: string;
  locked: boolean;
}

const AMBITOS = [
  "Comunicación Integral",
  "Interacción y Comprensión del Entorno",
  "Desarrollo Personal y Social",
  "Corporalidad y Movimiento",
  "Pensamiento Matemático",
  "Lenguaje Verbal",
  "Lenguaje Artístico",
  "Exploración del Entorno Natural",
  "Comprensión del Entorno Sociocultural",
  "Identidad y Autonomía",
  "Convivencia y Ciudadanía",
];

const NIVELES_EVAL = [
  { valor: 1, label: "No observado", color: "bg-gray-100 text-gray-600 border-gray-300" },
  { valor: 2, label: "No logrado", color: "bg-red-100 text-red-700 border-red-300" },
  { valor: 3, label: "En desarrollo", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { valor: 4, label: "Logrado", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
];

const mockEvaluaciones: Evaluacion[] = [
  { id: "eval-001", tenantId: "tenant-001", studentId: "alu-001", cursoId: "cur-002", ambito: "Comunicación Integral", hito: "Expresa necesidades con oraciones simples", nivel: 4, observacion: "Logra comunicarse con claridad", fecha: "2026-06-10", evaluadorId: "usr-003", locked: true },
  { id: "eval-002", tenantId: "tenant-001", studentId: "alu-001", cursoId: "cur-002", ambito: "Desarrollo Personal y Social", hito: "Comparte materiales con pares", nivel: 3, observacion: "En proceso, a veces necesita apoyo", fecha: "2026-06-10", evaluadorId: "usr-003", locked: true },
  { id: "eval-003", tenantId: "tenant-001", studentId: "alu-002", cursoId: "cur-003", ambito: "Pensamiento Matemático", hito: "Cuenta objetos hasta 10", nivel: 4, observacion: "Cuenta con seguridad", fecha: "2026-06-12", evaluadorId: "usr-003", locked: true },
  { id: "eval-004", tenantId: "tenant-001", studentId: "alu-004", cursoId: "cur-003", ambito: "Corporalidad y Movimiento", hito: "Corre y salta con coordinación", nivel: 3, observacion: "Mejorando equilibrio", fecha: "2026-06-13", evaluadorId: "usr-003", locked: false },
  { id: "eval-005", tenantId: "tenant-001", studentId: "alu-005", cursoId: "cur-001", ambito: "Lenguaje Verbal", hito: "Repite canciones y rimas", nivel: 2, observacion: "Requiere más estimulación", fecha: "2026-06-15", evaluadorId: "usr-002", locked: false },
];

export default function EvaluacionesPage() {
  const { currentUser } = useAuth();
  const { tenant } = useTenant();
  const { data: alumnos } = useStudents();
  const { data: cursos } = useCourses();

  const [localEvals, setLocalEvals] = useState<Evaluacion[]>(mockEvaluaciones);
  const [filterCurso, setFilterCurso] = useState("");
  const [filterAmbito, setFilterAmbito] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formStudent, setFormStudent] = useState("");
  const [formCurso, setFormCurso] = useState("");
  const [formAmbito, setFormAmbito] = useState(AMBITOS[0]);
  const [formHito, setFormHito] = useState("");
  const [formNivel, setFormNivel] = useState(3);
  const [formObs, setFormObs] = useState("");

  const filtered = useMemo(
    () => localEvals.filter((e) => {
      if (filterCurso && e.cursoId !== filterCurso) return false;
      if (filterAmbito && e.ambito !== filterAmbito) return false;
      return true;
    }).sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [localEvals, filterCurso, filterAmbito]
  );

  const alumnosCurso = formCurso ? alumnos.filter((a) => a.cursoId === formCurso && a.activo) : [];

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const ev: Evaluacion = {
      id: `eval-${Date.now()}`,
      tenantId: tenant.id,
      studentId: formStudent,
      cursoId: formCurso,
      ambito: formAmbito,
      hito: formHito,
      nivel: formNivel,
      observacion: formObs,
      fecha: "2026-06-17",
      evaluadorId: currentUser.id,
      locked: false,
    };
    setLocalEvals([ev, ...localEvals]);
    setShowForm(false);
    setFormHito(""); setFormObs(""); setFormStudent("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluaciones</h1>
          <p className="text-sm text-gray-500">Registro de hitos evaluativos por ámbito — BCEP</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> Registrar Evaluación
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-primary-200 bg-primary-50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Nueva Evaluación</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Curso *</label>
              <select value={formCurso} onChange={(e) => { setFormCurso(e.target.value); setFormStudent(""); }}
                required className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm">
                <option value="">Seleccionar...</option>
                {cursos.filter((c) => c.activo).map((c) => (
                  <option key={c.id} value={c.id}>{getCursoInformeName(c)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Alumno *</label>
              <select value={formStudent} onChange={(e) => setFormStudent(e.target.value)}
                required disabled={!formCurso} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm disabled:opacity-50">
                <option value="">Seleccionar...</option>
                {alumnosCurso.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombres} {a.apellidoPaterno}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Ámbito *</label>
              <select value={formAmbito} onChange={(e) => setFormAmbito(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm">
                {AMBITOS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Hito Evaluativo *</label>
              <input type="text" value={formHito} onChange={(e) => setFormHito(e.target.value)} required
                placeholder="Ej: Cuenta objetos hasta 10 con correspondencia 1 a 1"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nivel de Logro</label>
              <div className="grid grid-cols-4 gap-1.5">
                {NIVELES_EVAL.map((n) => (
                  <button key={n.valor} type="button" onClick={() => setFormNivel(n.valor)}
                    className={`rounded-lg border-2 px-2 py-2 text-xs font-medium transition-all active:scale-[0.97] ${
                      formNivel === n.valor ? `${n.color} ring-1` : "border-gray-200 bg-white text-gray-500"
                    }`}>
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Observación</label>
              <input type="text" value={formObs} onChange={(e) => setFormObs(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">Cancelar</button>
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
              <Save className="h-4 w-4" /> Guardar
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <select value={filterCurso} onChange={(e) => setFilterCurso(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="">Todos los cursos</option>
          {cursos.filter((c) => c.activo).map((c) => (
            <option key={c.id} value={c.id}>{getCursoDisplayName(c)}</option>
          ))}
        </select>
        <select value={filterAmbito} onChange={(e) => setFilterAmbito(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="">Todos los ámbitos</option>
          {AMBITOS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-5 py-3 font-semibold text-gray-600">Fecha</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Alumno</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Ámbito</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Hito</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Nivel</th>
              <th className="px-5 py-3 font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">Sin evaluaciones para estos filtros</td></tr>
            ) : (
              filtered.map((ev) => {
                const alumno = alumnos.find((a) => a.id === ev.studentId);
                const nivel = NIVELES_EVAL.find((n) => n.valor === ev.nivel);
                const curso = cursos.find((c) => c.id === ev.cursoId);
                return (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-600">{ev.fecha}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : ev.studentId}</p>
                      <p className="text-xs text-gray-500">{curso ? getCursoDisplayName(curso) : ""}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{ev.ambito}</td>
                    <td className="px-5 py-3 text-gray-700 max-w-xs">
                      <p className="truncate">{ev.hito}</p>
                      {ev.observacion && <p className="text-xs text-gray-400 truncate">{ev.observacion}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${nivel?.color || ""}`}>
                        {nivel?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {ev.locked ? (
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Lock className="h-3 w-3" /> Cerrado</span>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">Abierto</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
