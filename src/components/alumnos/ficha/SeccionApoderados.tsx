"use client";

import { UserCircle, Phone, Mail, Briefcase } from "lucide-react";
import type { Alumno } from "@/types";

export default function SeccionApoderados({ alumno }: { alumno: Alumno }) {
  if (alumno.apoderados.length === 0) {
    return <p className="text-gray-500">No hay apoderados registrados.</p>;
  }

  return (
    <div className="space-y-4">
      {alumno.apoderados.map((apo) => (
        <div key={apo.id} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <UserCircle className="h-7 w-7" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {apo.nombres} {apo.apellidoPaterno} {apo.apellidoMaterno}
                </h4>
                <p className="text-sm text-gray-500">
                  {apo.parentesco.charAt(0).toUpperCase() + apo.parentesco.slice(1)} &middot; RUT: {apo.rut}
                </p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              apo.esTitular
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              {apo.esTitular ? "Titular" : "Suplente"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{apo.telefono}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{apo.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{apo.ocupacion}</span>
            </div>
            {apo.lugarTrabajo && (
              <div className="text-sm text-gray-500">
                Lugar de trabajo: {apo.lugarTrabajo}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
