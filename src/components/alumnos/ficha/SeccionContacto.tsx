"use client";

import type { Alumno } from "@/types";

export default function SeccionContacto({ alumno }: { alumno: Alumno }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Campo label="Dirección" value={alumno.direccion} />
      <Campo label="Comuna" value={alumno.comuna} />
      <Campo label="Región" value={alumno.region} />
      <Campo label="Teléfono" value={alumno.telefono} />
      <Campo label="Email" value={alumno.email || "No registrado"} />
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
