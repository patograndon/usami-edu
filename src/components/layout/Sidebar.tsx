"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, UserCog, QrCode,
  NotebookPen, FileText, Stethoscope, CalendarDays, BarChart3,
  Mail, UtensilsCrossed, Clock, DollarSign, ShieldCheck,
  BellRing, Send, MessageCircle, Tablet, Crown, LogIn,
  Settings, ChevronLeft, ChevronRight, ChevronDown,
  GraduationCap, Menu, X, ClipboardList, Star, Briefcase,
  FileSpreadsheet, CreditCard, Database,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import type { PermissionKey } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  requiredPermission: PermissionKey | null;
  altPermission?: PermissionKey;
}

interface NavGroup {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

const navStructure: NavEntry[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, requiredPermission: null },
  {
    id: "academico", label: "Académico", icon: GraduationCap,
    items: [
      { href: "/cursos", label: "Cursos", icon: BookOpen, requiredPermission: "cursos.ver" },
      { href: "/alumnos", label: "Alumnos", icon: Users, requiredPermission: "alumnos.ver" },
      { href: "/calendario", label: "Calendario", icon: CalendarDays, requiredPermission: "calendario.ver" },
      { href: "/evaluaciones", label: "Evaluaciones", icon: Star, requiredPermission: "alumnos.ver" },
      { href: "/diario", label: "Bitácora de Aula", icon: NotebookPen, requiredPermission: "diario.registrar", altPermission: "diario.auditar" },
    ],
  },
  {
    id: "decreto170", label: "Decreto 170", icon: FileText,
    items: [
      { href: "/decreto170", label: "Auditoría D170", icon: FileText, requiredPermission: "d170.auditar", altPermission: "d170.ver" },
      { href: "/decreto170/fuei", label: "FUEI", icon: FileText, requiredPermission: "d170.auditar", altPermission: "d170.ver" },
      { href: "/decreto170/sesiones", label: "Sesiones", icon: Stethoscope, requiredPermission: "d170.sesiones" },
    ],
  },
  {
    id: "seguridad", label: "Seguridad", icon: ShieldCheck,
    items: [
      { href: "/seguridad", label: "Bitácora", icon: ShieldCheck, requiredPermission: "seguridad.ver" },
      { href: "/seguridad/registro", label: "Registro Acceso", icon: Tablet, requiredPermission: "seguridad.registrar", altPermission: "seguridad.emergencia" },
      { href: "/asistencia/retiro", label: "Retiro QR", icon: QrCode, requiredPermission: "asistencia.retiro" },
    ],
  },
  {
    id: "comunicacion", label: "Comunicación", icon: Mail,
    items: [
      { href: "/comunicaciones", label: "Circulares", icon: Mail, requiredPermission: "comunicaciones.ver", altPermission: "comunicaciones.crear" },
      { href: "/notificaciones", label: "Notificaciones", icon: BellRing, requiredPermission: "notificaciones.ver", altPermission: "notificaciones.enviar" },
      { href: "/notificaciones/enviar", label: "Enviar Mensaje", icon: Send, requiredPermission: "notificaciones.enviar" },
      { href: "/chat", label: "Chat", icon: MessageCircle, requiredPermission: "chat.ver", altPermission: "chat.enviar" },
    ],
  },
  {
    id: "admin", label: "Administración", icon: Settings,
    items: [
      { href: "/nutricion", label: "Nutrición", icon: UtensilsCrossed, requiredPermission: "menus.ver" },
      { href: "/reportes", label: "Reportes", icon: BarChart3, requiredPermission: "reportes.ver" },
      { href: "/rrhh", label: "RRHH", icon: Clock, requiredPermission: "rrhh.checkin", altPermission: "rrhh.ver" },
      { href: "/finanzas", label: "Finanzas", icon: DollarSign, requiredPermission: "finanzas.ver" },
      { href: "/personal", label: "Personal", icon: UserCog, requiredPermission: "personal.ver" },
      { href: "/configuracion", label: "Configuración", icon: Settings, requiredPermission: "configuracion.ver" },
    ],
  },
  { href: "/mineduc", label: "MINEDUC", icon: FileSpreadsheet, requiredPermission: "mineduc.exportar" },
  { href: "/sostenedor", label: "Sostenedor", icon: Briefcase, requiredPermission: "billing.ver" },
  { href: "/sostenedor/billing", label: "Facturación", icon: CreditCard, requiredPermission: "billing.ver" },
  { href: "/auditlog", label: "Audit Log", icon: Database, requiredPermission: "auditlog.ver" },
  { href: "/superadmin", label: "Superadmin", icon: Crown, requiredPermission: "configuracion.editar" },
  { href: "/login", label: "Login", icon: LogIn, requiredPermission: null },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ academico: true });
  const pathname = usePathname();
  const { hasPermission } = useAuth();
  const { esEscuelaLenguaje } = useTenant();

  function canSeeItem(item: NavItem): boolean {
    return item.requiredPermission === null ||
      hasPermission(item.requiredPermission) ||
      (!!item.altPermission && hasPermission(item.altPermission));
  }

  function toggleGroup(id: string) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function isItemActive(href: string): boolean {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function renderItem(item: NavItem, indent = false) {
    const isActive = isItemActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          indent ? "ml-3" : ""
        } ${
          isActive
            ? "bg-sidebar-active text-white"
            : "text-white/70 hover:bg-sidebar-hover hover:text-white"
        }`}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  }

  return (
    <>
      <button onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-sidebar p-2 text-white lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-50 flex h-screen flex-col bg-sidebar text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500">
              <GraduationCap className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-sm font-bold leading-tight">USAMI EDU</h1>
                <p className="text-xs text-primary-300">Parvularia</p>
              </div>
            )}
          </div>
          <button onClick={() => setMobileOpen(false)} className="rounded p-1 hover:bg-white/10 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navStructure.map((entry) => {
            if (!isGroup(entry)) {
              if (!canSeeItem(entry)) return null;
              return renderItem(entry);
            }

            const group = entry;
            if (group.id === "decreto170" && !esEscuelaLenguaje) return null;

            const visibleItems = group.items.filter(canSeeItem);
            if (visibleItems.length === 0) return null;

            const isGroupOpen = openGroups[group.id] ?? false;
            const hasActiveChild = visibleItems.some((item) => isItemActive(item.href));

            return (
              <div key={group.id}>
                <button
                  onClick={() => !collapsed && toggleGroup(group.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    hasActiveChild
                      ? "text-white bg-white/5"
                      : "text-white/50 hover:bg-sidebar-hover hover:text-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <group.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{group.label}</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isGroupOpen ? "rotate-180" : ""}`} />
                  )}
                </button>
                {(isGroupOpen || collapsed) && !collapsed && (
                  <div className="mt-0.5 space-y-0.5">
                    {visibleItems.map((item) => renderItem(item, true))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden border-t border-white/10 p-3 lg:block">
          <button onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-lg p-2 text-white/70 hover:bg-sidebar-hover hover:text-white">
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </aside>
    </>
  );
}
