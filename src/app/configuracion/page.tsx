"use client";

import { Building2, GraduationCap, Languages, Stethoscope, Brain, FileText, ClipboardList } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import type { Modalidad } from "@/types";

const modalidades: { value: Modalidad; label: string; descripcion: string; icon: typeof GraduationCap }[] = [
  {
    value: "jardin_infantil",
    label: "Jardín Infantil",
    descripcion: "Educación parvularia regular. Niveles desde Sala Cuna hasta Transición.",
    icon: GraduationCap,
  },
  {
    value: "escuela_lenguaje",
    label: "Escuela de Lenguaje",
    descripcion: "Incluye módulos de Fonoaudiología y Decreto 170. Necesidades Educativas Especiales Transitorias.",
    icon: Languages,
  },
];

export default function ConfiguracionPage() {
  const { tenant: tenantConfig, modalidad, setModalidad, modulosHabilitados, loaded } = useTenant();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500">Configuración del establecimiento</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Datos del Establecimiento</h2>
            <p className="text-sm text-gray-500">Información general</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Campo label="Nombre" value={tenantConfig.nombre} />
          <Campo label="RBD" value={tenantConfig.rbd} />
          <Campo label="Director/a" value={tenantConfig.director} />
          <Campo label="Dirección" value={tenantConfig.direccion} />
          <Campo label="Comuna" value={tenantConfig.comuna} />
          <Campo label="Región" value={tenantConfig.region} />
          <Campo label="Teléfono" value={tenantConfig.telefono} />
          <Campo label="Email" value={tenantConfig.email} />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Modalidad del Establecimiento</h2>
        <p className="mb-6 text-sm text-gray-500">
          Selecciona la modalidad para habilitar o deshabilitar los módulos correspondientes en las fichas de alumnos.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {modalidades.map((m) => (
            <button
              key={m.value}
              onClick={() => setModalidad(m.value)}
              className={`flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                modalidad === m.value
                  ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                modalidad === m.value
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}>
                <m.icon className="h-6 w-6" />
              </div>
              <div>
                <p className={`font-semibold ${
                  modalidad === m.value ? "text-primary-700" : "text-gray-900"
                }`}>
                  {m.label}
                </p>
                <p className="mt-1 text-sm text-gray-500">{m.descripcion}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Módulos de Especialistas</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ModuloEstado
              icon={FileText}
              nombre="Diagnóstico Clínico"
              descripcion="Diagnóstico CIE-10 y datos clínicos"
              habilitado={modulosHabilitados.diagnosticoClinico}
            />
            <ModuloEstado
              icon={Stethoscope}
              nombre="Fonoaudiología"
              descripcion="Ficha fonoaudiológica y sesiones"
              habilitado={modulosHabilitados.fonoaudiologia}
            />
            <ModuloEstado
              icon={Brain}
              nombre="Psicología"
              descripcion="Evaluación y seguimiento psicológico"
              habilitado={modulosHabilitados.psicologia}
            />
            <ModuloEstado
              icon={ClipboardList}
              nombre="Decreto 170"
              descripcion="NEE Transitorias y documentación"
              habilitado={modulosHabilitados.decreto170}
            />
          </div>
        </div>
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

function ModuloEstado({
  icon: Icon,
  nombre,
  descripcion,
  habilitado,
}: {
  icon: typeof Stethoscope;
  nombre: string;
  descripcion: string;
  habilitado: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 ${
      habilitado
        ? "border-emerald-200 bg-emerald-50"
        : "border-gray-200 bg-gray-50 opacity-60"
    }`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
        habilitado ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-400"
      }`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${habilitado ? "text-emerald-800" : "text-gray-500"}`}>{nombre}</p>
        <p className="text-xs text-gray-500 truncate">{descripcion}</p>
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
        habilitado ? "bg-emerald-200 text-emerald-800" : "bg-gray-200 text-gray-500"
      }`}>
        {habilitado ? "Activo" : "Inactivo"}
      </span>
    </div>
  );
}
