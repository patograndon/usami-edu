"use client";

import { useState, useMemo } from "react";
import { Clock, LogIn, LogOut, QrCode, Monitor } from "lucide-react";
import { staffAttendanceRecords } from "@/data/mock";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { ROLE_LABELS } from "@/types";
import type { StaffAttendance } from "@/types";

export default function RrhhPage() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();
  const { data: usuarios } = useUsers();
  const canView = hasPermission("rrhh.ver");
  const isDirector = currentUser.role === "director";

  const [localRecords, setLocalRecords] = useState<StaffAttendance[]>(staffAttendanceRecords);
  const [filterDate, setFilterDate] = useState("2026-06-17");

  const todayRecords = useMemo(
    () => localRecords.filter((r) => r.date === filterDate),
    [localRecords, filterDate]
  );

  const myRecord = todayRecords.find((r) => r.userId === currentUser.id);
  const isCheckedIn = myRecord?.checkIn && !myRecord?.checkOut;

  function handleCheckIn() {
    const now = `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;
    if (myRecord) return;
    const record: StaffAttendance = {
      id: `sa-${Date.now()}`,
      tenantId: tenant.id,
      userId: currentUser.id,
      date: filterDate,
      checkIn: now,
      checkOut: null,
      method: "web",
      horasTrabajadas: null,
    };
    setLocalRecords([...localRecords, record]);
  }

  function handleCheckOut() {
    if (!myRecord || myRecord.checkOut) return;
    const now = `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;
    const [hIn, mIn] = myRecord.checkIn!.split(":").map(Number);
    const [hOut, mOut] = now.split(":").map(Number);
    const hrs = Math.round(((hOut * 60 + mOut) - (hIn * 60 + mIn)) / 60 * 100) / 100;
    setLocalRecords(
      localRecords.map((r) =>
        r.id === myRecord.id ? { ...r, checkOut: now, horasTrabajadas: hrs } : r
      )
    );
  }

  const stats = useMemo(() => {
    const present = todayRecords.filter((r) => r.checkIn).length;
    const completed = todayRecords.filter((r) => r.checkOut).length;
    const totalHrs = todayRecords.reduce((sum, r) => sum + (r.horasTrabajadas || 0), 0);
    return { present, completed, pending: present - completed, totalHrs: Math.round(totalHrs * 10) / 10 };
  }, [todayRecords]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control de Horario — RRHH</h1>
          <p className="text-sm text-gray-500">Registro de asistencia del personal</p>
        </div>
        {isDirector && (
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
        )}
      </div>

      <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Mi registro de hoy</p>
            <p className="text-lg font-bold text-gray-900">{currentUser.nombreCompleto}</p>
            <p className="text-xs text-gray-500">{ROLE_LABELS[currentUser.role]}</p>
          </div>
          <div className="flex items-center gap-3">
            {myRecord?.checkIn && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Entrada</p>
                <p className="text-lg font-bold text-emerald-600">{myRecord.checkIn}</p>
              </div>
            )}
            {myRecord?.checkOut && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Salida</p>
                <p className="text-lg font-bold text-red-600">{myRecord.checkOut}</p>
              </div>
            )}
            {myRecord?.horasTrabajadas && (
              <div className="rounded-lg bg-primary-100 px-3 py-1.5 text-center">
                <p className="text-lg font-bold text-primary-700">{myRecord.horasTrabajadas}h</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          {!myRecord && (
            <button onClick={handleCheckIn}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[0.98]">
              <LogIn className="h-5 w-5" /> Registrar Entrada
            </button>
          )}
          {isCheckedIn && (
            <button onClick={handleCheckOut}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white hover:bg-red-700 active:scale-[0.98]">
              <LogOut className="h-5 w-5" /> Registrar Salida
            </button>
          )}
          {myRecord?.checkOut && (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 py-3.5 text-sm font-medium text-gray-500">
              <Clock className="h-5 w-5" /> Jornada completada
            </div>
          )}
        </div>
      </div>

      {isDirector && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-700">{stats.present}</p>
              <p className="text-xs text-emerald-600">Con entrada</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{stats.completed}</p>
              <p className="text-xs text-blue-600">Jornada completa</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
              <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
              <p className="text-xs text-amber-600">Sin salida</p>
            </div>
            <div className="rounded-xl border border-primary-200 bg-primary-50 p-3 text-center">
              <p className="text-2xl font-bold text-primary-700">{stats.totalHrs}</p>
              <p className="text-xs text-primary-600">Horas totales</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
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
                {todayRecords.map((record) => {
                  const user = usuarios.find((u) => u.id === record.userId);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{user?.nombreCompleto || record.userId}</td>
                      <td className="px-5 py-3 text-gray-600 text-xs">{user ? ROLE_LABELS[user.role] : ""}</td>
                      <td className="px-5 py-3">
                        {record.checkIn ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{record.checkIn}</span>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-3">
                        {record.checkOut ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">{record.checkOut}</span>
                        ) : <span className="text-xs text-amber-500 font-medium">En jornada</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          {record.method === "qr" ? <QrCode className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
                          {record.method === "qr" ? "QR" : "Web"}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-700">
                        {record.horasTrabajadas ? `${record.horasTrabajadas}h` : "—"}
                      </td>
                    </tr>
                  );
                })}
                {todayRecords.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-500">Sin registros para esta fecha</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
