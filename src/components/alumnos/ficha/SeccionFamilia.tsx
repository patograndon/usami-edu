"use client";

import { Users } from "lucide-react";
import type { Alumno } from "@/types";

export default function SeccionFamilia({ alumno }: { alumno: Alumno }) {
  if (alumno.grupoFamiliar.length === 0) {
    return <p className="text-gray-500">No hay información del grupo familiar registrada.</p>;
  }

  return (
    <div className="space-y-3">
      {alumno.grupoFamiliar.map((miembro, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{miembro.nombre}</p>
            <p className="text-sm text-gray-500">
              {miembro.parentesco} &middot; {miembro.edad} años
            </p>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            miembro.viveConAlumno
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {miembro.viveConAlumno ? "Vive con el alumno" : "No vive con el alumno"}
          </span>
        </div>
      ))}
    </div>
  );
}
