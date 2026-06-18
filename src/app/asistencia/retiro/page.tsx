"use client";

import { useState } from "react";
import {
  QrCode,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  validateQrHash,
  getAuthorizedRetireesForStudent,
  retirementLogs,
} from "@/data/mock";
import { useStudents } from "@/hooks/useStudents";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import type { AuthorizedRetiree, RetirementLog } from "@/types";

type RetiroStep = "scan" | "verified" | "rejected" | "confirmed";

export default function RetiroPage() {
  const { currentUser } = useAuth();
  const { tenant } = useTenant();
  const { data: alumnos } = useStudents();

  const [step, setStep] = useState<RetiroStep>("scan");
  const [qrInput, setQrInput] = useState("");
  const [matchedRetiree, setMatchedRetiree] = useState<AuthorizedRetiree | null>(null);
  const [matchedAlumno, setMatchedAlumno] = useState<typeof alumnos[0] | null>(null);
  const [localLogs, setLocalLogs] = useState<RetirementLog[]>(retirementLogs);

  function handleScanQR() {
    const retiree = validateQrHash(qrInput.trim());
    if (retiree) {
      const alumno = alumnos.find((a) => a.id === retiree.studentId);
      setMatchedRetiree(retiree);
      setMatchedAlumno(alumno || null);
      setStep("verified");
    } else {
      setMatchedRetiree(null);
      setMatchedAlumno(null);
      setStep("rejected");
    }
  }

  function handleConfirmRetiro() {
    if (!matchedRetiree || !matchedAlumno) return;
    const log: RetirementLog = {
      id: `rlog-${Date.now()}`,
      tenantId: tenant.id,
      studentId: matchedAlumno.id,
      authorizedByUserId: currentUser.id,
      retireeName: matchedRetiree.nombreCompleto,
      retireeRut: matchedRetiree.rut,
      retireeParentesco: matchedRetiree.parentesco,
      timestamp: new Date().toISOString(),
      qrCodeHashVerification: matchedRetiree.qrHash,
      verified: true,
    };
    setLocalLogs([log, ...localLogs]);
    setStep("confirmed");
  }

  function handleReset() {
    setStep("scan");
    setQrInput("");
    setMatchedRetiree(null);
    setMatchedAlumno(null);
  }

  const todayLogs = localLogs.filter((l) => {
    const logDate = l.timestamp.split("T")[0];
    return logDate === "2026-06-16" || logDate === "2026-06-15";
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistema de Retiro QR</h1>
        <p className="text-sm text-gray-500">
          Verificación de personas autorizadas para retiro de alumnos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {step === "scan" && (
            <div className="rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                  <QrCode className="h-10 w-10" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Escanear Código QR</h2>
                <p className="text-center text-sm text-gray-500">
                  Escanee el QR del apoderado o ingrese el código manualmente
                </p>

                <div className="flex w-full max-w-sm gap-2">
                  <input
                    type="text"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    placeholder="Código QR..."
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    onKeyDown={(e) => e.key === "Enter" && qrInput.trim() && handleScanQR()}
                  />
                  <button
                    onClick={handleScanQR}
                    disabled={!qrInput.trim()}
                    className="rounded-lg bg-primary-600 px-4 py-3 text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>

                <div className="w-full max-w-sm">
                  <p className="mb-2 text-xs font-medium text-gray-500">Prueba rápida (demo):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["qr_hash_carolina_001", "qr_hash_paola_002", "codigo_invalido"].map((code) => (
                      <button
                        key={code}
                        onClick={() => { setQrInput(code); }}
                        className="rounded-full bg-white border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        {code.replace("qr_hash_", "").replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "verified" && matchedRetiree && matchedAlumno && (
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-200 text-emerald-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-800">QR Verificado</h2>
                  <p className="text-sm text-emerald-600">Persona autorizada encontrada</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-emerald-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Persona que retira</p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xl font-bold">
                      {matchedRetiree.nombreCompleto.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{matchedRetiree.nombreCompleto}</p>
                      <p className="text-sm text-gray-600">RUT: {matchedRetiree.rut}</p>
                      <p className="text-sm text-gray-600">Parentesco: {matchedRetiree.parentesco}</p>
                      <p className="text-sm text-gray-600">Tel: {matchedRetiree.telefono}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Alumno a retirar</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold">
                      {matchedAlumno.nombres[0]}{matchedAlumno.apellidoPaterno[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {matchedAlumno.nombres} {matchedAlumno.apellidoPaterno} {matchedAlumno.apellidoMaterno}
                      </p>
                      <p className="text-sm text-gray-500">RUT: {matchedAlumno.rut}</p>
                    </div>
                  </div>
                </div>

                {matchedAlumno.salud.alergias.length > 0 && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-sm text-amber-700">
                      <strong>Alergias:</strong> {matchedAlumno.salud.alergias.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmRetiro}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 active:scale-[0.98]"
                >
                  <UserCheck className="h-5 w-5" />
                  Confirmar Retiro
                </button>
              </div>
            </div>
          )}

          {step === "rejected" && (
            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-200 text-red-700">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-red-800">QR NO VÁLIDO</h2>
                <p className="text-center text-sm text-red-600">
                  El código escaneado no corresponde a ninguna persona autorizada.
                  <br />
                  <strong>No se puede autorizar el retiro.</strong>
                </p>
                <button
                  onClick={handleReset}
                  className="rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}

          {step === "confirmed" && matchedAlumno && matchedRetiree && (
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-200 text-emerald-700">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-emerald-800">Retiro Confirmado</h2>
                <p className="text-center text-sm text-emerald-700">
                  <strong>{matchedAlumno.nombres} {matchedAlumno.apellidoPaterno}</strong> fue retirado por{" "}
                  <strong>{matchedRetiree.nombreCompleto}</strong>
                </p>
                <p className="text-xs text-emerald-600">
                  Autorizado por: {currentUser.nombreCompleto}
                </p>
                <button
                  onClick={handleReset}
                  className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Siguiente Retiro
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Clock className="h-5 w-5 text-gray-400" />
            Retiros de Hoy
          </h3>
          {todayLogs.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">Sin retiros registrados hoy</p>
          ) : (
            <div className="space-y-3">
              {todayLogs.map((log) => {
                const alumno = alumnos.find((a) => a.id === log.studentId);
                return (
                  <div key={log.id} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : log.studentId}
                      </p>
                      <p className="text-xs text-gray-500">
                        Retirado por: {log.retireeName} ({log.retireeParentesco})
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString("es-CL")}
                        {" · QR "}
                        {log.verified ? (
                          <span className="text-emerald-600">verificado</span>
                        ) : (
                          <span className="text-red-600">sin verificar</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs text-gray-400">
          Todos los retiros quedan registrados con: usuario autorizador, persona que retira (nombre, RUT, parentesco),
          timestamp exacto, y verificación QR. tenant_id: {tenant.id}
        </p>
      </div>
    </div>
  );
}
