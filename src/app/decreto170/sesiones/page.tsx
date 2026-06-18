"use client";

import { useState, useMemo } from "react";
import { Lock, Save, Stethoscope, Clock, Target } from "lucide-react";
import { alumnos, specialistSessions, decreto170Records } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { LOGRO_LABELS, SESSION_TYPE_LABELS } from "@/types";
import type { SpecialistSession, SessionType, LogroNivel } from "@/types";

const LOGRO_COLORS: Record<LogroNivel, string> = {
  1: "bg-red-100 text-red-700 border-red-300",
  2: "bg-red-50 text-red-600 border-red-200",
  3: "bg-orange-100 text-orange-700 border-orange-300",
  4: "bg-amber-100 text-amber-700 border-amber-300",
  5: "bg-lime-100 text-lime-700 border-lime-300",
  6: "bg-emerald-100 text-emerald-700 border-emerald-300",
  7: "bg-green-100 text-green-800 border-green-300",
};

export default function SesionesPage() {
  const { currentUser } = useAuth();
  const { tenant } = useTenant();

  const [localSessions, setLocalSessions] = useState<SpecialistSession[]>(specialistSessions);
  const [showForm, setShowForm] = useState(false);

  const [formStudentId, setFormStudentId] = useState("");
  const [formType, setFormType] = useState<SessionType>("individual");
  const [formDate, setFormDate] = useState("2026-06-16");
  const [formDuration, setFormDuration] = useState(30);
  const [formObjetivo, setFormObjetivo] = useState("");
  const [formActividad, setFormActividad] = useState("");
  const [formLogro, setFormLogro] = useState<LogroNivel>(4);
  const [formObs, setFormObs] = useState("");

  const mySessions = useMemo(
    () => localSessions
      .filter((s) => s.specialistId === currentUser.id)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [localSessions, currentUser.id]
  );

  const alumnosD170 = useMemo(
    () => {
      const ids = decreto170Records.map((r) => r.studentId);
      return alumnos.filter((a) => ids.includes(a.id));
    },
    []
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const session: SpecialistSession = {
      id: `ss-${Date.now()}`,
      tenantId: tenant.id,
      studentId: formStudentId,
      specialistId: currentUser.id,
      specialistRole: currentUser.role as "fonoaudiologo" | "psicologo" | "terapeuta_ocupacional",
      type: formType,
      date: formDate,
      durationMinutes: formDuration,
      objetivoTrabajado: formObjetivo,
      actividadResumen: formActividad,
      nivelLogro: formLogro,
      observaciones: formObs,
      locked: false,
      createdAt: new Date().toISOString(),
    };
    setLocalSessions([session, ...localSessions]);
    setShowForm(false);
    setFormStudentId("");
    setFormObjetivo("");
    setFormActividad("");
    setFormObs("");
    setFormLogro(3);
  }

  function handleLock(sessionId: string) {
    setLocalSessions(
      localSessions.map((s) =>
        s.id === sessionId ? { ...s, locked: true } : s
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diario de Sesiones</h1>
          <p className="text-sm text-gray-500">
            {currentUser.nombreCompleto} · {mySessions.length} sesiones registradas
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
        >
          <Stethoscope className="h-4 w-4" />
          Nueva Sesión
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-violet-200 bg-violet-50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Registrar Sesión</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Alumno <span className="text-red-500">*</span></label>
              <select value={formStudentId} onChange={(e) => setFormStudentId(e.target.value)} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500">
                <option value="">Seleccionar...</option>
                {alumnosD170.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombres} {a.apellidoPaterno}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tipo <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {(["individual", "grupal"] as SessionType[]).map((t) => (
                  <button key={t} type="button" onClick={() => setFormType(t)}
                    className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium ${formType === t ? "border-violet-500 bg-violet-200 text-violet-800" : "border-gray-200 bg-white"}`}>
                    {SESSION_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Fecha <span className="text-red-500">*</span></label>
              <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Duración (min) <span className="text-red-500">*</span></label>
              <input type="number" value={formDuration} onChange={(e) => setFormDuration(Number(e.target.value))} min={15} max={90} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Objetivo Trabajado <span className="text-red-500">*</span></label>
            <input type="text" value={formObjetivo} onChange={(e) => setFormObjetivo(e.target.value)} required
              placeholder="Ej: Producción de fonemas /r/ en posición inicial"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Resumen de Actividad <span className="text-red-500">*</span></label>
            <textarea value={formActividad} onChange={(e) => setFormActividad(e.target.value)} required rows={2}
              placeholder="Describa brevemente las actividades realizadas..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm resize-none focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Nivel de Logro <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-7 gap-1.5">
              {([1, 2, 3, 4, 5, 6, 7] as LogroNivel[]).map((n) => (
                <button key={n} type="button" onClick={() => setFormLogro(n)}
                  className={`rounded-lg border-2 px-3 py-3 text-center transition-all active:scale-[0.97] ${
                    formLogro === n ? LOGRO_COLORS[n] + " ring-1" : "border-gray-200 bg-white text-gray-500"
                  }`}>
                  <p className="text-lg font-bold">{n}</p>
                  <p className="text-xs">{LOGRO_LABELS[n]}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea value={formObs} onChange={(e) => setFormObs(e.target.value)} rows={2}
              placeholder="Observaciones adicionales..."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm resize-none focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400">Una vez guardada y bloqueada, la sesión no podrá ser editada (auditoría estatal)</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit"
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                <Save className="h-4 w-4" /> Guardar Sesión
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {mySessions.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">No hay sesiones registradas</p>
          </div>
        ) : (
          mySessions.map((session) => {
            const alumno = alumnos.find((a) => a.id === session.studentId);
            return (
              <div key={session.id} className={`rounded-xl border bg-white p-5 ${session.locked ? "border-gray-200" : "border-amber-300 bg-amber-50"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-sm font-bold">
                      {alumno ? `${alumno.nombres[0]}${alumno.apellidoPaterno[0]}` : "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : session.studentId}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.date} · {session.durationMinutes} min · {SESSION_TYPE_LABELS[session.type]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${LOGRO_COLORS[session.nivelLogro]}`}>
                      {session.nivelLogro}/7 {LOGRO_LABELS[session.nivelLogro]}
                    </span>
                    {session.locked ? (
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        <Lock className="h-3 w-3" /> Bloqueado
                      </span>
                    ) : (
                      <button onClick={() => handleLock(session.id)}
                        className="flex items-center gap-1 rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-300">
                        <Lock className="h-3 w-3" /> Bloquear
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 shrink-0 text-violet-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Objetivo</p>
                      <p className="text-sm text-gray-900">{session.objetivoTrabajado}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Actividad</p>
                    <p className="text-sm text-gray-700">{session.actividadResumen}</p>
                  </div>
                  {session.observaciones && (
                    <p className="text-xs text-gray-500 italic">{session.observaciones}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
