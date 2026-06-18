"use client";

import {
  Heart,
  AlertTriangle,
  Pill,
  Syringe,
  Stethoscope,
  Brain,
  FileText,
  ShieldCheck,
  ClipboardList,
  Ban,
  Camera,
  Ambulance,
} from "lucide-react";
import type { Alumno } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface ModulosHabilitados {
  fonoaudiologia: boolean;
  psicologia: boolean;
  diagnosticoClinico: boolean;
  decreto170: boolean;
}

interface SeccionSaludProps {
  alumno: Alumno;
  modulosHabilitados: ModulosHabilitados;
}

export default function SeccionSalud({ alumno, modulosHabilitados }: SeccionSaludProps) {
  const { salud, diagnosticoClinico, fonoaudiologia, psicologia } = alumno;
  const { currentUser } = useAuth();

  const canEditMeds = currentUser.role === "director" || currentUser.role === "educadora";
  const hasAlerts = salud.alergias.length > 0 || salud.enfermedadesCronicas.length > 0 || !salud.vacunasAlDia;

  const hayModulosEspecialistas =
    modulosHabilitados.diagnosticoClinico ||
    modulosHabilitados.fonoaudiologia ||
    modulosHabilitados.psicologia;

  return (
    <div className="space-y-6">
      {hasAlerts && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-base font-bold text-red-800">Alertas de Salud</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {salud.alergias.map((a) => (
              <span key={a} className="flex items-center gap-1 rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-800">
                <Ban className="h-3 w-3" /> {a}
              </span>
            ))}
            {salud.enfermedadesCronicas.map((e) => (
              <span key={e} className="flex items-center gap-1 rounded-full bg-orange-200 px-3 py-1 text-xs font-semibold text-orange-800">
                <Stethoscope className="h-3 w-3" /> {e}
              </span>
            ))}
            {!salud.vacunasAlDia && (
              <span className="flex items-center gap-1 rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
                <Syringe className="h-3 w-3" /> Vacunas pendientes
              </span>
            )}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-rose-500" />
          <h3 className="text-base font-bold text-gray-900">Condición General de Salud</h3>
        </div>
        <p className="text-sm text-gray-700">{salud.condicionGeneral || "Sin información registrada."}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Campo label="Grupo Sanguíneo" value={salud.grupoSanguineo} />
          <Campo label="Seguridad Social" value={salud.seguridadSocial} />
          <Campo label="Hospital Referencia" value={salud.hospitalReferencia} />
          <Campo label="Vacunas al Día" value={salud.vacunasAlDia ? "Sí" : "No"} highlight={!salud.vacunasAlDia} />
        </div>
      </div>

      {salud.alergias.length > 0 && (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Ban className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold text-amber-800">Alergias</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {salud.alergias.map((a) => (
              <span key={a} className="rounded-full bg-amber-200 px-3 py-1 text-sm font-semibold text-amber-900">{a}</span>
            ))}
          </div>
          {salud.alergiasDetalle && (
            <p className="text-sm text-amber-700 italic">{salud.alergiasDetalle}</p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-500" />
            <h3 className="text-base font-bold text-gray-900">Medicamentos</h3>
          </div>
          {!canEditMeds && (
            <span className="text-xs text-gray-400">Solo lectura</span>
          )}
        </div>
        {salud.medicamentos.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">Sin medicamentos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-2.5 font-semibold text-gray-600">Nombre</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-600">Dosis</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-600">Frecuencia</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-600">Hora</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-600">Receta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {salud.medicamentos.map((med, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{med.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{med.dosis}</td>
                    <td className="px-4 py-3 text-gray-600">{med.frecuencia}</td>
                    <td className="px-4 py-3 text-gray-600">{med.horaAdministracion}</td>
                    <td className="px-4 py-3">
                      {med.recetaAdjunta ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <FileText className="h-3.5 w-3.5" /> Adjunta
                        </span>
                      ) : (
                        <span className="text-xs text-red-500 font-medium">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <h3 className="text-base font-bold text-gray-900">Autorizaciones</h3>
        </div>
        <div className="space-y-3">
          <AutorizacionRow
            icon={Ambulance}
            label="Autorización para administrar primeros auxilios básicos"
            checked={salud.autorizaciones.primerosAuxilios}
          />
          <AutorizacionRow
            icon={Ambulance}
            label="Autorización para traslado a centro de urgencia"
            checked={salud.autorizaciones.trasladoUrgencia}
            detail={salud.autorizaciones.trasladoUrgencia ? `Contacto: ${salud.autorizaciones.contactoUrgenciaNombre} (${salud.autorizaciones.contactoUrgenciaTelefono})` : undefined}
          />
          <AutorizacionRow
            icon={Camera}
            label="Autorización de uso de imagen (Diario de Aula)"
            checked={salud.autorizaciones.usoImagen}
          />
        </div>
      </div>

      {salud.antecedentes && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-5 w-5 text-gray-500" />
            <h3 className="text-base font-bold text-gray-900">Antecedentes Médicos</h3>
          </div>
          <p className="text-sm text-gray-700">{salud.antecedentes}</p>
        </div>
      )}

      {salud.observacionesMedicas && salud.observacionesMedicas !== "Sin observaciones" && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-1 text-sm font-semibold text-gray-700">Observaciones Médicas</h4>
          <p className="text-sm text-gray-600">{salud.observacionesMedicas}</p>
        </div>
      )}

      {hayModulosEspecialistas && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Evaluación Clínica</h3>

          {modulosHabilitados.diagnosticoClinico && (
            <ModuloEspecialista icon={FileText} titulo="Diagnóstico Clínico" color="rose">
              {diagnosticoClinico ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CampoEsp label="Diagnóstico Principal" value={diagnosticoClinico.diagnosticoPrincipal} />
                  <CampoEsp label="CIE-10" value={diagnosticoClinico.cie10} />
                  <CampoEsp label="Fecha Diagnóstico" value={diagnosticoClinico.fechaDiagnostico} />
                  <CampoEsp label="Profesional" value={diagnosticoClinico.profesionalDiagnostico} />
                  <CampoEsp label="Institución" value={diagnosticoClinico.institucionDiagnostico} />
                  {diagnosticoClinico.observaciones && (
                    <div className="sm:col-span-2">
                      <CampoEsp label="Observaciones" value={diagnosticoClinico.observaciones} />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-rose-600">Sin diagnóstico clínico registrado.</p>
              )}
            </ModuloEspecialista>
          )}

          {modulosHabilitados.fonoaudiologia && (
            <ModuloEspecialista icon={Syringe} titulo="Fonoaudiología — Decreto 170" color="violet">
              {fonoaudiologia ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CampoEsp label="Diagnóstico" value={fonoaudiologia.diagnostico} />
                  <CampoEsp label="Decreto 170" value={fonoaudiologia.decreto170 ? "Sí aplica" : "No aplica"} />
                  <CampoEsp label="NEE" value={fonoaudiologia.nee} />
                  <CampoEsp label="Fecha Ingreso" value={fonoaudiologia.fechaIngreso} />
                  <CampoEsp label="Profesional Tratante" value={fonoaudiologia.profesionalTratante} />
                  <CampoEsp label="Frecuencia Sesiones" value={fonoaudiologia.frecuenciaSesiones} />
                  {fonoaudiologia.observaciones && (
                    <div className="sm:col-span-2">
                      <CampoEsp label="Observaciones" value={fonoaudiologia.observaciones} />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-violet-600">Sin ficha de fonoaudiología registrada.</p>
              )}
            </ModuloEspecialista>
          )}

          {modulosHabilitados.psicologia && (
            <ModuloEspecialista icon={Brain} titulo="Psicología" color="teal">
              {psicologia ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <CampoEsp label="Diagnóstico" value={psicologia.diagnostico} />
                  <CampoEsp label="Fecha Ingreso" value={psicologia.fechaIngreso} />
                  <CampoEsp label="Profesional Tratante" value={psicologia.profesionalTratante} />
                  <CampoEsp label="Frecuencia Sesiones" value={psicologia.frecuenciaSesiones} />
                  {psicologia.areasIntervenir.length > 0 && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium text-teal-600 mb-1">Áreas a Intervenir</p>
                      <div className="flex flex-wrap gap-1.5">
                        {psicologia.areasIntervenir.map((a) => (
                          <span key={a} className="rounded-full bg-teal-200 px-2.5 py-0.5 text-xs font-medium text-teal-800">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {psicologia.observaciones && (
                    <div className="sm:col-span-2">
                      <CampoEsp label="Observaciones" value={psicologia.observaciones} />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-teal-600">Sin ficha psicológica registrada.</p>
              )}
            </ModuloEspecialista>
          )}
        </div>
      )}
    </div>
  );
}

function Campo({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${highlight ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-0.5 text-sm font-medium ${highlight ? "text-red-700" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function CampoEsp({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function AutorizacionRow({ icon: Icon, label, checked, detail }: {
  icon: typeof Ambulance;
  label: string;
  checked: boolean;
  detail?: string;
}) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${checked ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded ${checked ? "bg-emerald-500 text-white" : "bg-red-200 text-red-500"}`}>
        {checked ? <span className="text-xs font-bold">✓</span> : <span className="text-xs font-bold">✗</span>}
      </div>
      <div>
        <p className={`text-sm font-medium ${checked ? "text-emerald-800" : "text-red-700"}`}>{label}</p>
        {detail && <p className="text-xs text-emerald-600 mt-0.5">{detail}</p>}
      </div>
    </div>
  );
}

const colorMap = {
  violet: { border: "border-violet-200", bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", title: "text-violet-900" },
  rose: { border: "border-rose-200", bg: "bg-rose-50", icon: "bg-rose-100 text-rose-600", title: "text-rose-900" },
  teal: { border: "border-teal-200", bg: "bg-teal-50", icon: "bg-teal-100 text-teal-600", title: "text-teal-900" },
};

function ModuloEspecialista({
  icon: Icon,
  titulo,
  color,
  children,
}: {
  icon: typeof Stethoscope;
  titulo: string;
  color: keyof typeof colorMap;
  children: React.ReactNode;
}) {
  const c = colorMap[color];
  return (
    <div className={`mb-4 rounded-xl border-2 ${c.border} ${c.bg} p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.icon}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h4 className={`text-base font-bold ${c.title}`}>{titulo}</h4>
      </div>
      {children}
    </div>
  );
}
