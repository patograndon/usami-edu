"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FichaAlumno from "@/components/alumnos/ficha/FichaAlumno";
import { getAlumnoById } from "@/data/mock";
import { useTenant } from "@/context/TenantContext";

export default function AlumnoFichaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const alumno = getAlumnoById(id);
  const { modulosHabilitados, loaded } = useTenant();

  if (!alumno) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-gray-900">Alumno no encontrado</p>
        <Link href="/alumnos" className="mt-4 text-primary-600 hover:text-primary-700">
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/alumnos"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ficha de Alumno 2026</h1>
          <p className="text-sm text-gray-500">
            {alumno.nombres} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
          </p>
        </div>
      </div>

      <FichaAlumno alumno={alumno} modulosHabilitados={modulosHabilitados} />
    </div>
  );
}
