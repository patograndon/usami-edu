"use client";

import { useState } from "react";
import { Plus, Users, BookOpen, ClipboardCheck, Wifi } from "lucide-react";
import Link from "next/link";
import { useCourses } from "@/hooks/useCourses";
import { useStudents } from "@/hooks/useStudents";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { NIVELES_LABELS, getCursoDisplayName } from "@/types";
import { createCourse } from "@/services/api";
import { mapApiCourse, LEVEL_FRONT_TO_API } from "@/services/mappers";
import type { Curso, NivelEducativo } from "@/types";

const nivelesOptions: { value: NivelEducativo; label: string }[] = [
  { value: "sala_cuna_menor", label: "Sala Cuna Menor" },
  { value: "sala_cuna_mayor", label: "Sala Cuna Mayor" },
  { value: "medio_menor", label: "Medio Menor" },
  { value: "medio_mayor", label: "Medio Mayor" },
  { value: "transicion_menor", label: "NT1 (Primer Nivel Transición)" },
  { value: "transicion_mayor", label: "NT2 (Segundo Nivel Transición)" },
];

export default function CursosPage() {
  const { tenant } = useTenant();
  const { isApiConnected } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formLevel, setFormLevel] = useState<NivelEducativo>("sala_cuna_menor");
  const [formName, setFormName] = useState("");
  const [formEducadora, setFormEducadora] = useState("");
  const [formCapacidad, setFormCapacidad] = useState(25);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const { data: cursos, loading, isFromApi, mutate: setCursos } = useCourses();
  const { data: alumnos } = useStudents();

  function alumnosEnCurso(cursoId: string): number {
    return alumnos.filter((a) => a.cursoId === cursoId).length;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (isApiConnected) {
      setSaving(true);
      try {
        const raw = await createCourse({
          officialLevel: LEVEL_FRONT_TO_API[formLevel],
          creativeName: formName.trim() || undefined,
          year: 2026,
          capacity: formCapacidad,
        });
        const mapped = mapApiCourse(raw);
        mapped.educadoraTitular = formEducadora.trim();
        setCursos((prev) => [...prev, mapped]);
      } catch (err: any) {
        setFormError(err.message || "Error al crear curso");
        setSaving(false);
        return;
      }
      setSaving(false);
    } else {
      const nuevo: Curso = {
        id: `cur-${Date.now()}`,
        tenantId: tenant.id,
        officialLevel: formLevel,
        creativeName: formName.trim() || null,
        educadoraTitular: formEducadora.trim(),
        capacidad: formCapacidad,
        anio: 2026,
        activo: true,
      };
      setCursos((prev) => [...prev, nuevo]);
    }

    setShowForm(false);
    setFormLevel("sala_cuna_menor");
    setFormName("");
    setFormEducadora("");
    setFormCapacidad(25);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Cargando..." : `${cursos.length} cursos activos · Año 2026`}
            {isFromApi && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                <Wifi className="h-3 w-3" /> API
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Curso
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-primary-200 bg-primary-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Crear Nuevo Curso</h2>

          {formError && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formError}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nivel Oficial <span className="text-red-500">*</span>
              </label>
              <select
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value as NivelEducativo)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {nivelesOptions.map((n) => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Nivel normativo según la regulación chilena</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombre Creativo
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej: Los Exploradores, Mundo de Voces..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">Opcional. Si se deja vacío, los informes usarán el nivel oficial</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Educadora Titular <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formEducadora}
                onChange={(e) => setFormEducadora(e.target.value)}
                required
                placeholder="Nombre completo de la educadora"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Capacidad <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formCapacidad}
                onChange={(e) => setFormCapacidad(Number(e.target.value))}
                required
                min={1}
                max={45}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {formName.trim() && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-700">Vista previa en Informes:</p>
              <p className="mt-1 text-sm font-semibold text-blue-900">
                {formName.trim()} <span className="font-normal text-blue-600">({NIVELES_LABELS[formLevel]})</span>
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              tenant_id: {tenant.id} (asignado automáticamente)
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? "Creando..." : "Crear Curso"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cursos.map((curso) => {
          const count = alumnosEnCurso(curso.id);
          return (
            <div key={curso.id} className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md hover:border-primary-300 group">
              <Link href={`/cursos/${curso.id}`} className="block cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">{getCursoDisplayName(curso)}</h3>
                      <p className="text-xs text-gray-500">{NIVELES_LABELS[curso.officialLevel]}</p>
                    </div>
                  </div>
                  {curso.creativeName && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                      Nombre creativo
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Educadora</span>
                    <span className="font-medium text-gray-700">{curso.educadoraTitular}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Alumnos</span>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700">{count} / {curso.capacidad}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        count / curso.capacidad > 0.9 ? "bg-red-500" : count / curso.capacidad > 0.7 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min((count / curso.capacidad) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </Link>

              <Link
                href={`/asistencia?curso=${curso.id}`}
                className="mt-4 flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 p-3 hover:border-primary-300 hover:bg-primary-100 transition-colors"
              >
                <div className="flex items-center gap-2 text-primary-700">
                  <ClipboardCheck className="h-4 w-4" />
                  <span className="text-sm font-semibold">Tomar asistencia</span>
                </div>
                <span className="text-xs text-primary-500">{count} alumnos</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
