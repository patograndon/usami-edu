"use client";

import { useState, useMemo } from "react";
import {
  LogIn, LogOut, ShieldCheck, Clock, User, Users as UsersIcon,
  Eye, Lock, UserCheck, AlertTriangle, Monitor, QrCode,
  BarChart3,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { securityLogs, staffAttendanceRecords } from "@/data/mock";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { SECURITY_TYPE_LABELS, SECURITY_ROLE_LABELS, ROLE_LABELS } from "@/types";
import type { SecurityLog, SecurityRole } from "@/types";

type TabId = "personal" | "visitas" | "retiros";

export default function SeguridadAuditoriaPage() {
  const { currentUser, hasPermission } = useAuth();
  const { data: usuarios } = useUsers();
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [localLogs] = useState<SecurityLog[]>(securityLogs);

  const todayLogs = useMemo(
    () => localLogs.filter((l) => l.timestamp.startsWith("2026-06-17")).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [localLogs]
  );

  const staffLogs = todayLogs.filter((l) => l.role === "staff");
  const visitorLogs = todayLogs.filter((l) => l.role === "visitor");
  const parentLogs = todayLogs.filter((l) => l.role === "parent");

  const stats = useMemo(() => ({
    totalEntries: todayLogs.filter((l) => l.type === "entry").length,
    totalExits: todayLogs.filter((l) => l.type === "exit").length,
    staffPresent: staffAttendanceRecords.filter((r) => r.date === "2026-06-17" && r.checkIn && !r.checkOut).length,
    visitorsInside: visitorLogs.filter((l) => l.type === "entry").length - visitorLogs.filter((l) => l.type === "exit").length,
    retiros: parentLogs.filter((l) => l.type === "exit").length,
  }), [todayLogs, staffLogs, visitorLogs, parentLogs]);

  const flowByHour = useMemo(() => {
    const hours: Record<string, { hour: string; entradas: number; salidas: number }> = {};
    for (let h = 7; h <= 18; h++) {
      const label = `${String(h).padStart(2, "0")}:00`;
      hours[label] = { hour: label, entradas: 0, salidas: 0 };
    }
    for (const log of todayLogs) {
      const h = log.timestamp.split("T")[1]?.substring(0, 2);
      const label = `${h}:00`;
      if (hours[label]) {
        if (log.type === "entry") hours[label].entradas++;
        else hours[label].salidas++;
      }
    }
    return Object.values(hours);
  }, [todayLogs]);

  const peakEntry = flowByHour.reduce((max, h) => h.entradas > max.entradas ? h : max, flowByHour[0]);
  const peakExit = flowByHour.reduce((max, h) => h.salidas > max.salidas ? h : max, flowByHour[0]);

  const tabs: { id: TabId; label: string; icon: typeof User; count: number }[] = [
    { id: "personal", label: "Personal", icon: User, count: staffLogs.length },
    { id: "visitas", label: "Visitas", icon: Eye, count: visitorLogs.length },
    { id: "retiros", label: "Retiros de Alumnos", icon: UserCheck, count: parentLogs.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seguridad — Auditoría</h1>
          <p className="text-sm text-gray-500">Bitácora en tiempo real · Solo visualización</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
          <Lock className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500">Los registros se crean exclusivamente desde la Tablet de Portería</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Ingresos" value={stats.totalEntries} icon={LogIn} color="emerald" />
        <StatCard label="Salidas" value={stats.totalExits} icon={LogOut} color="red" />
        <StatCard label="Personal en jornada" value={stats.staffPresent} icon={User} color="blue" />
        <StatCard label="Visitantes adentro" value={stats.visitorsInside} icon={Eye} color="violet" />
        <StatCard label="Retiros hoy" value={stats.retiros} icon={UserCheck} color="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary-500" />
            <h2 className="text-base font-bold text-gray-900">Flujo de Personas por Hora</h2>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowByHour} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="entradas" fill="#22c55e" radius={[3, 3, 0, 0]} name="Entradas" />
                <Bar dataKey="salidas" fill="#ef4444" radius={[3, 3, 0, 0]} name="Salidas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-base font-bold text-gray-900">Horas Pico</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
              <LogIn className="mx-auto h-6 w-6 text-emerald-600 mb-1" />
              <p className="text-2xl font-bold text-emerald-700">{peakEntry?.hour || "—"}</p>
              <p className="text-xs text-emerald-600">Hora pico ingreso</p>
              <p className="text-xs text-gray-500">{peakEntry?.entradas || 0} registros</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <LogOut className="mx-auto h-6 w-6 text-red-600 mb-1" />
              <p className="text-2xl font-bold text-red-700">{peakExit?.hour || "—"}</p>
              <p className="text-xs text-red-600">Hora pico salida</p>
              <p className="text-xs text-gray-500">{peakExit?.salidas || 0} registros</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              Total del día: <strong>{todayLogs.length}</strong> registros ·
              Personal: {staffLogs.length} · Apoderados: {parentLogs.length} · Visitas: {visitorLogs.length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{tab.count}</span>
          </button>
        ))}
      </div>

      {activeTab === "personal" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-3">
            <p className="text-sm font-medium text-gray-700">Asistencia del personal — Horarios de ingreso/salida</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 font-semibold text-gray-600">Personal</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Rol</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Entrada</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Salida</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Método</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">Horas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffAttendanceRecords.filter((r) => r.date === "2026-06-17").map((record) => {
                  const user = usuarios.find((u) => u.id === record.userId);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{user?.nombreCompleto || record.userId}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{user ? ROLE_LABELS[user.role] : ""}</td>
                      <td className="px-5 py-3">
                        {record.checkIn ? <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{record.checkIn}</span> : "—"}
                      </td>
                      <td className="px-5 py-3">
                        {record.checkOut ? <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">{record.checkOut}</span> : <span className="text-xs text-amber-600 font-medium">En jornada</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          {record.method === "qr" ? <QrCode className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
                          {record.method === "qr" ? "QR" : "Web"}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-700">{record.horasTrabajadas ? `${record.horasTrabajadas}h` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "visitas" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-3">
            <p className="text-sm font-medium text-gray-700">Visitantes — Quién está dentro del establecimiento</p>
          </div>
          <div className="divide-y divide-gray-100">
            {visitorLogs.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500">Sin visitantes registrados hoy</p>
            ) : (
              visitorLogs.map((log) => {
                const hasExit = visitorLogs.some((l) => l.personRut === log.personRut && l.type === "exit");
                return (
                  <div key={log.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold ${
                      log.type === "entry" ? "bg-emerald-500" : "bg-red-500"
                    }`}>
                      {log.type === "entry" ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{log.personName}</p>
                      <p className="text-xs text-gray-500">RUT: {log.personRut} · {log.timestamp.split("T")[1]?.substring(0, 5)}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      log.type === "entry" && !hasExit ? "bg-emerald-100 text-emerald-700" :
                      log.type === "exit" ? "bg-gray-100 text-gray-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {log.type === "entry" ? (hasExit ? "Salió" : "Adentro") : "Salida"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === "retiros" && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-5 py-3">
            <p className="text-sm font-medium text-gray-700">Retiros de alumnos — Historial con verificación QR</p>
          </div>
          <div className="divide-y divide-gray-100">
            {parentLogs.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500">Sin retiros registrados hoy</p>
            ) : (
              parentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-600 text-xs font-bold`}>
                    {log.personName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{log.personName}</p>
                    <p className="text-sm text-gray-600">RUT: {log.personRut}</p>
                    {log.relatedStudentName && (
                      <p className="text-sm text-primary-600">Alumno: {log.relatedStudentName}</p>
                    )}
                    <p className="text-xs text-gray-400">{log.timestamp.replace("T", " ").substring(0, 16)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      log.type === "entry" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      {SECURITY_TYPE_LABELS[log.type]}
                    </span>
                    {log.verifiedAgainstAuthorized ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600"><ShieldCheck className="h-3 w-3" /> QR Verificado</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600"><AlertTriangle className="h-3 w-3" /> Manual</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {hasPermission("seguridad.emergencia") && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-700">
              <strong>Registro de emergencia:</strong> Como Director, puede registrar entradas/salidas de emergencia desde
              <a href="/seguridad/registro" className="ml-1 font-semibold text-amber-800 underline">la interfaz de registro</a>.
              Esta función es solo para situaciones excepcionales.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: typeof LogIn; color: string;
}) {
  const colors: Record<string, string> = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 ${colors[color]}`}>
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs font-medium">{label}</p>
      </div>
    </div>
  );
}
