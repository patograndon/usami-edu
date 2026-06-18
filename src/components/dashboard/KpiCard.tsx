"use client";

import { UserCheck, UserX, HeartPulse, ShieldAlert, type LucideIcon } from "lucide-react";
import type { KpiData } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  UserCheck,
  UserX,
  HeartPulse,
  ShieldAlert,
};

const colorMap = {
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: "bg-emerald-100 text-emerald-600",
    border: "border-emerald-200",
  },
  danger: {
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "bg-red-100 text-red-600",
    border: "border-red-200",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: "bg-amber-100 text-amber-600",
    border: "border-amber-200",
  },
  primary: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    icon: "bg-indigo-100 text-indigo-600",
    border: "border-indigo-200",
  },
};

export default function KpiCard({ data }: { data: KpiData }) {
  const Icon = iconMap[data.icono];
  const colors = colorMap[data.color];

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} p-6 transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{data.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${colors.text}`}>{data.valor}</span>
            {data.total && (
              <span className="text-sm text-gray-500">/ {data.total}</span>
            )}
          </div>
        </div>
        <div className={`rounded-lg p-3 ${colors.icon}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
}
