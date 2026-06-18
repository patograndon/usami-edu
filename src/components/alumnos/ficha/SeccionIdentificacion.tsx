"use client";

import { User } from "lucide-react";
import type { Alumno } from "@/types";
import { NIVELES_LABELS } from "@/types";

function calcularEdad(fechaNacimiento: string): string {
  const nac = new Date(fechaNacimiento);
  const hoy = new Date();
  let anos = hoy.getFullYear() - nac.getFullYear();
  let meses = hoy.getMonth() - nac.getMonth();
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  return `${anos} años, ${meses} meses`;
}

export default function SeccionIdentificacion({ alumno }: { alumno: Alumno }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
          <User className="h-12 w-12" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900">
            {alumno.nombres} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
          </h3>
          <p className="text-sm text-gray-500">RUT: {alumno.rut}</p>
          <p className="text-sm text-gray-500">{calcularEdad(alumno.fechaNacimiento)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Campo label="Fecha de Nacimiento" value={new Date(alumno.fechaNacimiento).toLocaleDateString("es-CL")} />
        <Campo label="Género" value={alumno.genero.charAt(0).toUpperCase() + alumno.genero.slice(1)} />
        <Campo label="Nacionalidad" value={alumno.nacionalidad} />
        <Campo label="Nivel" value={NIVELES_LABELS[alumno.nivel]} />
        <Campo label="Fecha Matrícula" value={new Date(alumno.fechaMatricula).toLocaleDateString("es-CL")} />
        <Campo label="Estado" value={alumno.activo ? "Activo" : "Inactivo"} />
      </div>
    </div>
  );
}

function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
