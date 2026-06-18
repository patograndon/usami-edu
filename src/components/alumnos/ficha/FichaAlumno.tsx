"use client";

import { useState, useMemo } from "react";
import {
  UserCircle,
  MapPin,
  Users,
  HeartPulse,
  Shield,
  Phone,
  QrCode,
  Lock,
} from "lucide-react";
import type { Alumno, PermissionKey } from "@/types";
import { TAB_PERMISSION_MAP } from "@/types";
import { useAuth } from "@/context/AuthContext";
import SeccionIdentificacion from "./SeccionIdentificacion";
import SeccionContacto from "./SeccionContacto";
import SeccionFamilia from "./SeccionFamilia";
import SeccionSalud from "./SeccionSalud";
import SeccionApoderados from "./SeccionApoderados";
import SeccionEmergencia from "./SeccionEmergencia";
import SeccionSeguridadQR from "./SeccionSeguridadQR";

const allTabs = [
  { id: "identificacion", label: "Identificación", icon: UserCircle },
  { id: "contacto", label: "Contacto", icon: MapPin },
  { id: "familia", label: "Familia", icon: Users },
  { id: "salud", label: "Salud", icon: HeartPulse },
  { id: "apoderados", label: "Apoderados", icon: Shield },
  { id: "emergencia", label: "Emergencia", icon: Phone },
  { id: "qr", label: "Seguridad QR", icon: QrCode },
] as const;

type TabId = (typeof allTabs)[number]["id"];

interface ModulosHabilitados {
  fonoaudiologia: boolean;
  psicologia: boolean;
  diagnosticoClinico: boolean;
  decreto170: boolean;
}

interface FichaAlumnoProps {
  alumno: Alumno;
  modulosHabilitados: ModulosHabilitados;
}

export default function FichaAlumno({ alumno, modulosHabilitados }: FichaAlumnoProps) {
  const { hasPermission, currentUser } = useAuth();

  const visibleTabs = useMemo(
    () =>
      allTabs.filter((tab) => {
        const perm = TAB_PERMISSION_MAP[tab.id] as PermissionKey | undefined;
        return !perm || hasPermission(perm);
      }),
    [hasPermission]
  );

  const defaultTab = useMemo(() => {
    const saludFirst = currentUser.role === "educadora" || currentUser.role === "asistente";
    if (saludFirst && visibleTabs.some((t) => t.id === "salud")) return "salud" as TabId;
    return visibleTabs.length > 0 ? visibleTabs[0].id : "identificacion" as TabId;
  }, [currentUser.role, visibleTabs]);

  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const safeActiveTab = visibleTabs.some((t) => t.id === activeTab)
    ? activeTab
    : visibleTabs[0]?.id;

  if (visibleTabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
        <Lock className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">
          No tienes permisos para ver secciones de esta ficha.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <nav className="flex gap-1 border-b border-gray-200">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                safeActiveTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {safeActiveTab === "identificacion" && <SeccionIdentificacion alumno={alumno} />}
        {safeActiveTab === "contacto" && <SeccionContacto alumno={alumno} />}
        {safeActiveTab === "familia" && <SeccionFamilia alumno={alumno} />}
        {safeActiveTab === "salud" && <SeccionSalud alumno={alumno} modulosHabilitados={modulosHabilitados} />}
        {safeActiveTab === "apoderados" && <SeccionApoderados alumno={alumno} />}
        {safeActiveTab === "emergencia" && <SeccionEmergencia alumno={alumno} />}
        {safeActiveTab === "qr" && <SeccionSeguridadQR alumno={alumno} />}
      </div>
    </div>
  );
}
