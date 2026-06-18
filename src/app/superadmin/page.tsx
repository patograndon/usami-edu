"use client";

import { useState, useMemo } from "react";
import {
  Building2, Users, HardDrive, Shield, Eye, ToggleLeft, ToggleRight,
  Plus, Clock, AlertTriangle, Check, MessageSquare, Crown, UserCog,
  Ticket, ChevronDown, ChevronUp, Lock,
} from "lucide-react";
import { auditLogs, supportTickets, usuarios } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenantsList } from "@/hooks/useTenants";
import { PLAN_LABELS } from "@/types";
import type { TenantSaaS, SubscriptionPlan, AuditLog, SupportTicket } from "@/types";

type Tab = "tenants" | "flags" | "audit" | "soporte";

const ALL_MODULES = [
  { id: "asistencia", label: "Asistencia" },
  { id: "diario", label: "Diario de Aula" },
  { id: "cursos", label: "Cursos" },
  { id: "comunicaciones", label: "Comunicaciones" },
  { id: "nutricion", label: "Nutrición" },
  { id: "calendario", label: "Calendario" },
  { id: "reportes", label: "Reportes" },
  { id: "chat", label: "Chat" },
  { id: "seguridad", label: "Seguridad QR" },
  { id: "rrhh", label: "RRHH" },
  { id: "finanzas", label: "Finanzas" },
  { id: "decreto170", label: "Decreto 170" },
  { id: "fonoaudiologia", label: "Fonoaudiología" },
  { id: "psicologia", label: "Psicología" },
  { id: "notificaciones", label: "Notificaciones Push" },
];

const PLAN_COLORS: Record<SubscriptionPlan, string> = {
  basico: "bg-gray-100 text-gray-700",
  profesional: "bg-blue-100 text-blue-700",
  enterprise: "bg-violet-100 text-violet-700",
};

export default function SuperadminPage() {
  const { currentUser, switchUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("tenants");
  const { data: tenants, isFromApi, mutate: setTenants } = useTenantsList();
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);
  const [impersonating, setImpersonating] = useState<string | null>(null);

  if (currentUser.role !== "superadmin" && currentUser.role !== "director") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">Panel exclusivo para Superadministrador.</p>
      </div>
    );
  }

  const stats = useMemo(() => ({
    totalTenants: tenants.length,
    activeTenants: tenants.filter((t) => t.isActive).length,
    totalAlumnos: tenants.reduce((s, t) => s + t.alumnosCount, 0),
    totalStorage: tenants.reduce((s, t) => s + t.storageUsedMb, 0),
    openTickets: supportTickets.filter((t) => t.status !== "resuelto").length,
  }), [tenants]);

  function toggleModule(tenantId: string, moduleId: string) {
    setTenants((prev) => prev.map((t) => {
      if (t.id !== tenantId) return t;
      const has = t.modulosActivos.includes(moduleId);
      return {
        ...t,
        modulosActivos: has
          ? t.modulosActivos.filter((m) => m !== moduleId)
          : [...t.modulosActivos, moduleId],
      };
    }));
  }

  function handleImpersonate(tenantId: string) {
    const director = usuarios.find((u) => u.tenantId === tenantId && u.role === "director");
    if (director) {
      switchUser(director.id);
      setImpersonating(tenantId);
    }
  }

  function handleStopImpersonation() {
    switchUser("usr-superadmin");
    setImpersonating(null);
  }

  const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
    { id: "tenants", label: "Centros Educativos", icon: Building2 },
    { id: "flags", label: "Feature Flags", icon: ToggleRight },
    { id: "audit", label: "Auditoría Global", icon: Clock },
    { id: "soporte", label: "Soporte", icon: Ticket },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900">Panel Superadministrador</h1>
          </div>
          <p className="text-sm text-gray-500">Gestión SaaS Multi-Tenant — USAMI EDU</p>
        </div>
        {impersonating && (
          <button onClick={handleStopImpersonation}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
            <Eye className="h-4 w-4" /> Salir de suplantación
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-3 text-center">
          <p className="text-2xl font-bold text-primary-700">{stats.totalTenants}</p>
          <p className="text-xs text-primary-600">Centros</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{stats.activeTenants}</p>
          <p className="text-xs text-emerald-600">Activos</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.totalAlumnos}</p>
          <p className="text-xs text-blue-600">Alumnos Total</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-center">
          <p className="text-2xl font-bold text-violet-700">{(stats.totalStorage / 1024).toFixed(1)} GB</p>
          <p className="text-xs text-violet-600">Almacenamiento</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{stats.openTickets}</p>
          <p className="text-xs text-amber-600">Tickets Abiertos</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === "tenants" && (
        <div className="space-y-3">
          {tenants.map((tenant) => (
            <div key={tenant.id} className={`rounded-xl border bg-white ${tenant.isActive ? "border-gray-200" : "border-gray-200 opacity-60"}`}>
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{tenant.nombre}</p>
                    <p className="text-sm text-gray-500">RBD: {tenant.rbd} · {tenant.comuna}, {tenant.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${PLAN_COLORS[tenant.plan]}`}>{PLAN_LABELS[tenant.plan]}</span>
                  <div className="text-right text-xs text-gray-500">
                    <p>{tenant.alumnosCount} alumnos · {tenant.personalCount} personal</p>
                    <p>{tenant.storageUsedMb} MB</p>
                  </div>
                  <button onClick={() => handleImpersonate(tenant.id)} title="Suplantar vista de Director"
                    className="rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => setExpandedTenant(expandedTenant === tenant.id ? null : tenant.id)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                    {expandedTenant === tenant.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {expandedTenant === tenant.id && (
                <div className="border-t border-gray-200 px-5 py-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                    <div><span className="text-gray-500">Director:</span> <span className="font-medium">{tenant.directorEmail}</span></div>
                    <div><span className="text-gray-500">Plan:</span> <span className="font-medium">{PLAN_LABELS[tenant.plan]}</span></div>
                    <div><span className="text-gray-500">Módulos:</span> <span className="font-medium">{tenant.modulosActivos.length}</span></div>
                    <div><span className="text-gray-500">Desde:</span> <span className="font-medium">{tenant.createdAt}</span></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "flags" && (
        <div className="space-y-4">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-5 w-5 text-primary-500" />
                <h3 className="font-bold text-gray-900">{tenant.nombre}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${PLAN_COLORS[tenant.plan]}`}>{PLAN_LABELS[tenant.plan]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {ALL_MODULES.map((mod) => {
                  const isActive = tenant.modulosActivos.includes(mod.id);
                  return (
                    <button key={mod.id} onClick={() => toggleModule(tenant.id, mod.id)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all ${
                        isActive ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}>
                      <span className="font-medium truncate">{mod.label}</span>
                      {isActive ? <ToggleRight className="h-4 w-4 shrink-0 text-emerald-500" /> : <ToggleLeft className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "audit" && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 font-semibold text-gray-600">Hora</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Tenant</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Usuario</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Acción</th>
                <th className="px-5 py-3 font-semibold text-gray-600">Detalle</th>
                <th className="px-5 py-3 font-semibold text-gray-600">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((log) => (
                <tr key={log.id} className={`hover:bg-gray-50 ${log.action === "IMPERSONATION" ? "bg-amber-50" : ""}`}>
                  <td className="px-5 py-3 text-gray-600 text-xs whitespace-nowrap">{log.timestamp.replace("T", " ").substring(0, 16)}</td>
                  <td className="px-5 py-3 text-gray-600">{log.tenantId}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{log.userName}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      log.action === "IMPERSONATION" ? "bg-amber-200 text-amber-800" :
                      log.action.includes("LOGIN") ? "bg-emerald-100 text-emerald-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{log.action}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-xs max-w-xs truncate">{log.detail}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "soporte" && (
        <div className="space-y-3">
          {supportTickets.map((ticket) => (
            <div key={ticket.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{ticket.subject}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      ticket.status === "abierto" ? "bg-red-100 text-red-700" :
                      ticket.status === "en_progreso" ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {ticket.status === "abierto" ? "Abierto" : ticket.status === "en_progreso" ? "En Progreso" : "Resuelto"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{ticket.description}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    {ticket.tenantName} · {ticket.createdBy} · {ticket.createdAt.replace("T", " ").substring(0, 16)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
