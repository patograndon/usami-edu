"use client";

import { Phone, ShieldCheck, ShieldOff } from "lucide-react";
import type { Alumno } from "@/types";

export default function SeccionEmergencia({ alumno }: { alumno: Alumno }) {
  if (alumno.contactosEmergencia.length === 0) {
    return <p className="text-gray-500">No hay contactos de emergencia registrados.</p>;
  }

  return (
    <div className="space-y-3">
      {alumno.contactosEmergencia.map((contacto) => (
        <div key={contacto.id} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            contacto.autorizadoRetirar
              ? "bg-emerald-100 text-emerald-600"
              : "bg-gray-100 text-gray-500"
          }`}>
            {contacto.autorizadoRetirar ? (
              <ShieldCheck className="h-5 w-5" />
            ) : (
              <ShieldOff className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{contacto.nombreCompleto}</p>
            <p className="text-sm text-gray-500">{contacto.parentesco}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4 text-gray-400" />
            {contacto.telefono}
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            contacto.autorizadoRetirar
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}>
            {contacto.autorizadoRetirar ? "Puede retirar" : "No retira"}
          </span>
        </div>
      ))}
    </div>
  );
}
