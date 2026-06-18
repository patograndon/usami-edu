"use client";

import Link from "next/link";
import type { Alumno } from "@/types";
import { NIVELES_LABELS, ESTADO_LABELS, getCursoDisplayName } from "@/types";
import { getCursoById } from "@/data/mock";

const estadoStyles = {
  presente: "bg-emerald-100 text-emerald-700",
  ausente: "bg-red-100 text-red-700",
  justificado: "bg-amber-100 text-amber-700",
  retirado: "bg-gray-100 text-gray-700",
};

export default function AlumnoTable({ alumnos }: { alumnos: Alumno[] }) {
  if (alumnos.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">No se encontraron alumnos</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 font-semibold text-gray-600">RUT</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Nombre Completo</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Curso</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Estado</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alumnos.map((alumno) => (
              <tr key={alumno.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-600">{alumno.rut}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {alumno.nombres} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
                    </p>
                    <p className="text-xs text-gray-500">{alumno.comuna}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {(() => {
                    const curso = alumno.cursoId ? getCursoById(alumno.cursoId) : null;
                    if (curso) {
                      return (
                        <div>
                          <p className="font-medium text-gray-700">{getCursoDisplayName(curso)}</p>
                          {curso.creativeName && (
                            <p className="text-xs text-gray-500">{NIVELES_LABELS[curso.officialLevel]}</p>
                          )}
                        </div>
                      );
                    }
                    return <span className="text-gray-600">{NIVELES_LABELS[alumno.nivel]}</span>;
                  })()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoStyles[alumno.estadoAsistencia]}`}>
                    {ESTADO_LABELS[alumno.estadoAsistencia]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/alumnos/${alumno.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Ver Ficha
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
