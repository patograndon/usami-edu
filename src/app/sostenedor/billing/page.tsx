"use client";

import { useState } from "react";
import {
  CreditCard, AlertTriangle, Check, X, Building2,
  Shield, Lock, DollarSign,
} from "lucide-react";
import { tenantBilling } from "@/data/mock";
import { useTenantsList } from "@/hooks/useTenants";
import { useAuth } from "@/context/AuthContext";
import { PLAN_LABELS } from "@/types";
import type { TenantBilling, BillingStatus } from "@/types";

const STATUS_CONFIG: Record<BillingStatus, { label: string; color: string }> = {
  activo: { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
  por_vencer: { label: "Por Vencer", color: "bg-amber-100 text-amber-700" },
  vencido: { label: "Vencido", color: "bg-red-100 text-red-700" },
  suspendido: { label: "Suspendido", color: "bg-gray-100 text-gray-500" },
};

function fmt(n: number) { return "$" + n.toLocaleString("es-CL"); }

export default function BillingPage() {
  const { currentUser, hasPermission } = useAuth();
  const [localBilling] = useState<TenantBilling[]>(tenantBilling);

  if (!hasPermission("billing.ver")) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">Portal de facturación exclusivo para Sostenedores.</p>
      </div>
    );
  }

  const totalMensual = localBilling.reduce((s, b) => s + b.monthlyAmount, 0);
  const activos = localBilling.filter((b) => b.status === "activo").length;
  const alertas = localBilling.filter((b) => b.status === "por_vencer" || b.status === "vencido").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Suscripciones</h1>
        <p className="text-sm text-gray-500">Portal de facturación del Sostenedor</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{localBilling.length}</p>
          <p className="text-xs text-gray-500">Sedes</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{activos}</p>
          <p className="text-xs text-emerald-600">Activas</p>
        </div>
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-center">
          <p className="text-xl font-bold text-primary-700">{fmt(totalMensual)}</p>
          <p className="text-xs text-primary-600">Total Mensual</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{alertas}</p>
          <p className="text-xs text-red-600">Con alertas</p>
        </div>
      </div>

      {localBilling.some((b) => b.status === "vencido") && (
        <div className="flex items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-800">Suscripción vencida detectada</p>
            <p className="text-xs text-red-700">Los módulos del establecimiento con suscripción vencida serán deshabilitados automáticamente.</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {localBilling.map((bill) => {
          const st = STATUS_CONFIG[bill.status];
          return (
            <div key={bill.tenantId} className={`rounded-xl border bg-white p-5 ${
              bill.status === "vencido" ? "border-red-300" : bill.status === "por_vencer" ? "border-amber-300" : "border-gray-200"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary-500" />
                  <div>
                    <p className="font-bold text-gray-900">{bill.tenantName}</p>
                    <p className="text-xs text-gray-500">{bill.modulesIncluded.length} módulos incluidos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    bill.plan === "enterprise" ? "bg-violet-100 text-violet-700" : bill.plan === "profesional" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                  }`}>{PLAN_LABELS[bill.plan]}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.color}`}>{st.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-500">Monto mensual</p>
                  <p className="text-lg font-bold text-gray-900">{fmt(bill.monthlyAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Próximo pago</p>
                  <p className={`text-sm font-semibold ${bill.status === "vencido" ? "text-red-600" : "text-gray-700"}`}>{bill.nextPaymentDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Último pago</p>
                  <p className="text-sm text-gray-700">{bill.lastPaymentDate || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Método</p>
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <CreditCard className="h-3.5 w-3.5" />
                    {bill.paymentMethod}
                  </div>
                </div>
              </div>

              {bill.status === "vencido" && (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">Módulos deshabilitados por falta de pago</p>
                  <button className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">
                    Regularizar Pago
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
