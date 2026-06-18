"use client";

import { useState } from "react";
import {
  QrCode, Camera, LogIn, LogOut, ShieldCheck, ShieldAlert,
  UserCheck, Search, Lock, AlertTriangle, Tablet,
} from "lucide-react";
import { securityLogs, validateSecurityQr } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import type { SecurityLog, SecurityLogType, SecurityRole } from "@/types";

type ScanStep = "idle" | "photo" | "verified" | "rejected" | "registered";

export default function RegistroTabletPage() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();

  const canRegister = hasPermission("seguridad.registrar");
  const canEmergency = hasPermission("seguridad.emergencia");

  if (!canRegister && !canEmergency) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">
          Este módulo es exclusivo para la Tablet de Portería (SecurityGate) o registro de emergencia del Director.
        </p>
      </div>
    );
  }

  const [localLogs, setLocalLogs] = useState<SecurityLog[]>(securityLogs);
  const [step, setStep] = useState<ScanStep>("idle");
  const [qrInput, setQrInput] = useState("");
  const [scanResult, setScanResult] = useState<ReturnType<typeof validateSecurityQr> | null>(null);
  const [regType, setRegType] = useState<SecurityLogType>("entry");
  const [regName, setRegName] = useState("");
  const [regRut, setRegRut] = useState("");
  const [regRole, setRegRole] = useState<SecurityRole>("parent");

  function handleScanQr() {
    const result = validateSecurityQr(qrInput.trim());
    setScanResult(result);
    if (result.valid && result.retiree) {
      setRegName(result.retiree.nombreCompleto);
      setRegRut(result.retiree.rut);
      setRegRole("parent");
      setStep("photo");
    } else {
      setStep("rejected");
    }
  }

  function handleConfirm() {
    const timestamp = "2026-06-17T" + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const fileName = `record_${regType}_${regRut.replace(/\./g, "")}_${Date.now()}.jpg`;
    const log: SecurityLog = {
      id: `sec-${Date.now()}`,
      tenantId: tenant.id,
      personId: scanResult?.retiree?.id || `manual-${Date.now()}`,
      personName: regName,
      personRut: regRut,
      type: regType,
      role: regRole,
      photoUrl: `/photos/${fileName}`,
      timestamp,
      method: scanResult?.valid ? "qr" : "manual",
      relatedStudentId: scanResult?.students[0]?.id || null,
      relatedStudentName: scanResult?.students[0] ? `${scanResult.students[0].nombres} ${scanResult.students[0].apellidoPaterno}` : null,
      verifiedAgainstAuthorized: scanResult?.valid || false,
      registeredBy: currentUser.id,
    };
    setLocalLogs([log, ...localLogs]);
    setStep("registered");
  }

  function handleReset() {
    setStep("idle");
    setQrInput("");
    setScanResult(null);
    setRegName("");
    setRegRut("");
  }

  const isEmergency = canEmergency && !canRegister;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Tablet className="h-5 w-5 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isEmergency ? "Registro de Emergencia" : "Tablet de Portería"}
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            {isEmergency
              ? "Modo de emergencia — Solo para situaciones excepcionales"
              : "Escanear QR · Tomar Foto · Registrar"
            }
          </p>
        </div>
        {isEmergency && (
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5" /> Modo Emergencia
          </span>
        )}
      </div>

      {step === "idle" && (
        <div className="rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 p-10">
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-100 text-primary-600">
              <QrCode className="h-14 w-14" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Escanear Código QR</h2>
            <p className="text-center text-sm text-gray-500 max-w-sm">
              Presente el código QR del apoderado o personal frente a la cámara de la tablet.
            </p>

            <div className="flex h-40 w-full max-w-md items-center justify-center rounded-xl border-2 border-gray-300 bg-white">
              <div className="text-center">
                <Camera className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-xs text-gray-400">Cámara de escaneo QR</p>
              </div>
            </div>

            <div className="flex w-full max-w-md gap-2">
              <input type="text" value={qrInput} onChange={(e) => setQrInput(e.target.value)}
                placeholder="Código QR..." onKeyDown={(e) => e.key === "Enter" && qrInput.trim() && handleScanQr()}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm" />
              <button onClick={handleScanQr} disabled={!qrInput.trim()}
                className="rounded-xl bg-primary-600 px-6 py-3.5 text-white hover:bg-primary-700 disabled:opacity-50 active:scale-[0.97]">
                <Search className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <p className="w-full text-xs text-gray-500 text-center">Demo:</p>
              {["qr_hash_carolina_001", "qr_hash_paola_002", "codigo_invalido"].map((code) => (
                <button key={code} onClick={() => setQrInput(code)}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 active:scale-[0.97]">
                  {code.replace("qr_hash_", "").replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "photo" && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-10">
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-56 w-full max-w-sm items-center justify-center rounded-2xl border-2 border-amber-300 bg-white">
              <div className="text-center">
                <Camera className="mx-auto h-16 w-16 text-amber-400 animate-pulse" />
                <p className="mt-2 font-semibold text-amber-700">Capturando foto...</p>
                <p className="text-sm text-amber-600">{regName}</p>
              </div>
            </div>
            <button onClick={() => setStep("verified")}
              className="w-full max-w-sm rounded-2xl bg-amber-500 py-4 text-lg font-bold text-white hover:bg-amber-600 active:scale-[0.98]">
              Capturar Foto
            </button>
          </div>
        </div>
      )}

      {step === "verified" && scanResult?.retiree && (
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-8 w-8 text-emerald-600" />
            <h2 className="text-xl font-bold text-emerald-800">Persona Verificada</h2>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-200 text-emerald-700 text-3xl font-bold">
              {regName.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{regName}</p>
              <p className="text-lg text-gray-600">RUT: {regRut}</p>
              {scanResult.students.length > 0 && (
                <p className="text-lg text-primary-600 font-semibold">
                  Alumno: {scanResult.students.map(s => `${s.nombres} ${s.apellidoPaterno}`).join(", ")}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button onClick={() => setRegType("entry")}
              className={`rounded-2xl border-2 p-6 text-center transition-all active:scale-[0.97] ${
                regType === "entry" ? "border-emerald-500 bg-emerald-200 text-emerald-800" : "border-gray-200 bg-white text-gray-500"
              }`}>
              <LogIn className="mx-auto h-8 w-8 mb-2" />
              <p className="text-lg font-bold">Ingreso</p>
            </button>
            <button onClick={() => setRegType("exit")}
              className={`rounded-2xl border-2 p-6 text-center transition-all active:scale-[0.97] ${
                regType === "exit" ? "border-red-500 bg-red-200 text-red-800" : "border-gray-200 bg-white text-gray-500"
              }`}>
              <LogOut className="mx-auto h-8 w-8 mb-2" />
              <p className="text-lg font-bold">Salida / Retiro</p>
            </button>
          </div>
          <div className="flex gap-4">
            <button onClick={handleReset}
              className="flex-1 rounded-2xl border border-gray-300 bg-white py-4 text-lg font-medium text-gray-700 active:scale-[0.98]">
              Cancelar
            </button>
            <button onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white hover:bg-emerald-700 active:scale-[0.97]">
              <UserCheck className="h-6 w-6" /> Confirmar
            </button>
          </div>
        </div>
      )}

      {step === "rejected" && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-10">
          <div className="flex flex-col items-center gap-6">
            <ShieldAlert className="h-20 w-20 text-red-600" />
            <h2 className="text-2xl font-bold text-red-800">QR NO VÁLIDO</h2>
            <p className="text-lg text-red-600 text-center">
              Este código no corresponde a ninguna persona autorizada.<br />
              <strong>No se puede autorizar el acceso.</strong>
            </p>
            <button onClick={handleReset}
              className="w-full max-w-sm rounded-2xl bg-red-600 py-4 text-lg font-bold text-white hover:bg-red-700 active:scale-[0.98]">
              Intentar de nuevo
            </button>
          </div>
        </div>
      )}

      {step === "registered" && (
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-10">
          <div className="flex flex-col items-center gap-6">
            <ShieldCheck className="h-20 w-20 text-emerald-600" />
            <h2 className="text-2xl font-bold text-emerald-800">Registro Exitoso</h2>
            <p className="text-lg text-emerald-700">{regName} — {regType === "entry" ? "Ingreso" : "Salida"} registrado</p>
            <button onClick={handleReset}
              className="w-full max-w-sm rounded-2xl bg-primary-600 py-4 text-lg font-bold text-white hover:bg-primary-700 active:scale-[0.98]">
              Siguiente Registro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
