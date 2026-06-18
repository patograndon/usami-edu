"use client";

import { useState, useMemo } from "react";
import { Shield, Lock, Database, Eye } from "lucide-react";
import { detailedAuditLogs } from "@/data/mock";
import { useTenantsList } from "@/hooks/useTenants";
import { useAuth } from "@/context/AuthContext";
import type { DetailedAuditLog } from "@/types";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function AuditLogPage() {
  const { currentUser, hasPermission } = useAuth();
  const { data: tenantsSaaS } = useTenantsList();

  if (!hasPermission("auditlog.ver")) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">
          El Log de Auditoría es accesible solo para Sostenedor (sus datos) y Superadministrador (global).
        </p>
      </div>
    );
  }

  const isSuperadmin = currentUser.role === "superadmin";
  const [filterTenant, setFilterTenant] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterResource, setFilterResource] = useState("");

  const visibleLogs = useMemo(() => {
    let logs = detailedAuditLogs;
    if (!isSuperadmin) {
      logs = logs.filter((l) => l.tenantId === "tenant-001");
    }
    if (filterTenant) logs = logs.filter((l) => l.tenantId === filterTenant);
    if (filterAction) logs = logs.filter((l) => l.action === filterAction);
    if (filterResource) logs = logs.filter((l) => l.resource === filterResource);
    return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [isSuperadmin, filterTenant, filterAction, filterResource]);

  const resources = [...new Set(detailedAuditLogs.map((l) => l.resource))];

  const stats = useMemo(() => ({
    total: visibleLogs.length,
    creates: visibleLogs.filter((l) => l.action === "CREATE").length,
    updates: visibleLogs.filter((l) => l.action === "UPDATE").length,
    deletes: visibleLogs.filter((l) => l.action === "DELETE").length,
  }), [visibleLogs]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-gray-500" />
          <h1 className="text-2xl font-bold text-gray-900">Log de Auditoría</h1>
        </div>
        <p className="text-sm text-gray-500">
          Registro inmutable de acciones WRITE (Create, Update, Delete) · {isSuperadmin ? "Vista global" : "Solo su establecimiento"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total registros</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{stats.creates}</p>
          <p className="text-xs text-emerald-600">CREATE</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.updates}</p>
          <p className="text-xs text-blue-600">UPDATE</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.deletes}</p>
          <p className="text-xs text-red-600">DELETE</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {isSuperadmin && (
          <select value={filterTenant} onChange={(e) => setFilterTenant(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="">Todos los tenants</option>
            {tenantsSaaS.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            <option value="global">Global</option>
          </select>
        )}
        <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="">Todas las acciones</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select value={filterResource} onChange={(e) => setFilterResource(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option value="">Todas las tablas</option>
          {resources.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-semibold text-gray-600">Timestamp</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Actor</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Recurso</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Acción</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Valor Anterior</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Valor Nuevo</th>
              <th className="px-4 py-3 font-semibold text-gray-600">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{log.timestamp.replace("T", " ").substring(0, 19)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 text-xs">{log.actorName}</p>
                  <p className="text-[10px] text-gray-500">{log.actorRole} · {log.tenantId}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">{log.resource}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ACTION_COLORS[log.action]}`}>{log.action}</span>
                </td>
                <td className="px-4 py-3 max-w-[150px]">
                  {log.oldValue ? (
                    <code className="block truncate rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-700">{log.oldValue}</code>
                  ) : <span className="text-[10px] text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 max-w-[150px]">
                  {log.newValue ? (
                    <code className="block truncate rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">{log.newValue}</code>
                  ) : <span className="text-[10px] text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-gray-400">{log.clientIp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs text-gray-400">
          Middleware AuditLog captura el 100% de acciones WRITE en tablas críticas.
          Registros inmutables — no pueden ser editados ni eliminados.
          Acceso: Superadministrador (global) · Sostenedor (solo su tenant_id) · Director NO tiene acceso.
        </p>
      </div>
    </div>
  );
}
