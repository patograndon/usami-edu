"use client";

import { useState, useMemo } from "react";
import { UserPlus, AlertTriangle, Wifi } from "lucide-react";
import Link from "next/link";
import AlumnoSearch from "@/components/alumnos/AlumnoSearch";
import AlumnoTable from "@/components/alumnos/AlumnoTable";
import StudentRegistration from "@/components/alumnos/StudentRegistration";
import { useStudents } from "@/hooks/useStudents";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/context/AuthContext";
import { useSetupStatus } from "@/hooks/useSetupStatus";
import type { Alumno } from "@/types";

export default function AlumnosPage() {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { hasPermission } = useAuth();

  const { data: alumnos, loading, isFromApi, mutate: setAlumnos } = useStudents();
  const { data: cursos } = useCourses();
  const setupStatus = useSetupStatus(cursos, alumnos);

  const canCreate = hasPermission("alumnos.crear");
  const canRegister = canCreate && setupStatus.coursesCreated;

  const filtered = useMemo(() => {
    if (!query.trim()) return alumnos;
    const q = query.toLowerCase();
    return alumnos.filter(
      (a) =>
        a.nombres.toLowerCase().includes(q) ||
        a.apellidoPaterno.toLowerCase().includes(q) ||
        a.apellidoMaterno.toLowerCase().includes(q) ||
        a.rut.includes(q)
    );
  }, [query, alumnos]);

  function handleSave(nuevo: Alumno) {
    setAlumnos((prev) => [nuevo, ...prev]);
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Alumnos</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Cargando..." : `${alumnos.length} alumnos matriculados`}
            {isFromApi && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                <Wifi className="h-3 w-3" /> API
              </span>
            )}
          </p>
        </div>
        {canCreate && (
          <div className="flex items-center gap-3">
            {!setupStatus.coursesCreated && (
              <div className="flex items-center gap-1.5 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium">Debe crear cursos primero</span>
              </div>
            )}
            <button
              onClick={() => canRegister && setShowForm(!showForm)}
              disabled={!canRegister}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                canRegister
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title={
                !canRegister
                  ? "Debe crear al menos un curso antes de registrar alumnos"
                  : undefined
              }
            >
              <UserPlus className="h-4 w-4" />
              Nuevo Alumno
            </button>
          </div>
        )}
      </div>

      {!setupStatus.coursesCreated && canCreate && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              No hay cursos creados en este establecimiento
            </p>
            <p className="text-xs text-amber-600">
              Para matricular alumnos, primero debe crear al menos un curso con su nivel oficial.
            </p>
          </div>
          <Link
            href="/cursos"
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            Crear Curso
          </Link>
        </div>
      )}

      {showForm && canRegister && (
        <StudentRegistration
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          availableCourses={cursos}
        />
      )}

      <div className="max-w-md">
        <AlumnoSearch value={query} onChange={setQuery} />
      </div>

      <AlumnoTable alumnos={filtered} />
    </div>
  );
}
