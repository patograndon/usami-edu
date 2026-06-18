"use client";

import { useState } from "react";
import {
  UserPlus,
  Shield,
  Lock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Wifi,
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/hooks/useUsers";
import { createUser } from "@/services/api";
import { mapApiUser, ROLE_FRONT_TO_API } from "@/services/mappers";
import {
  ROLE_LABELS,
  ALL_PERMISSIONS,
  DEFAULT_PERMISSIONS,
} from "@/types";
import type { User, UserRole, PermissionKey } from "@/types";

const roleOptions: UserRole[] = [
  "director",
  "educadora",
  "asistente",
  "fonoaudiologo",
  "psicologo",
  "terapeuta_ocupacional",
  "asistente_social",
  "medico",
  "nutricionista",
  "encargado_convivencia",
  "administrativo",
  "security_gate",
  "superadmin",
  "sostenedor",
];

export default function PersonalPage() {
  const { tenant } = useTenant();
  const { hasPermission, isApiConnected } = useAuth();
  const { data: users, loading, isFromApi, mutate: setUsers } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formEmail, setFormEmail] = useState("");
  const [formNombre, setFormNombre] = useState("");
  const [formRut, setFormRut] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("educadora");
  const [formPassword, setFormPassword] = useState("");

  if (!hasPermission("personal.gestionar")) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">
          No tienes permisos para gestionar personal.
        </p>
      </div>
    );
  }

  function resetForm() {
    setFormEmail("");
    setFormNombre("");
    setFormRut("");
    setFormRole("educadora");
    setFormPassword("");
    setShowForm(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (isApiConnected) {
      try {
        const raw = await createUser({
          email: formEmail,
          password: formPassword || "Usami2026!",
          fullName: formNombre,
          rut: formRut,
          role: ROLE_FRONT_TO_API[formRole],
        });
        const mapped = mapApiUser(raw);
        setUsers((prev) => [...prev, mapped]);
      } catch (err: any) {
        alert(err.message || "Error al crear usuario");
        setSaving(false);
        return;
      }
    } else {
      const nuevo: User = {
        id: `usr-${Date.now()}`,
        tenantId: tenant.id,
        email: formEmail,
        passwordHash: "",
        nombreCompleto: formNombre,
        rut: formRut,
        role: formRole,
        permissions: [...DEFAULT_PERMISSIONS[formRole]],
        cursoAsignado: null,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [...prev, nuevo]);
    }

    setSaving(false);
    resetForm();
  }

  function toggleActive(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      )
    );
  }

  function togglePermission(userId: string, perm: PermissionKey) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const has = u.permissions.includes(perm);
        return {
          ...u,
          permissions: has
            ? u.permissions.filter((p) => p !== perm)
            : [...u.permissions, perm],
        };
      })
    );
  }

  function changeRole(userId: string, newRole: UserRole) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: newRole, permissions: [...DEFAULT_PERMISSIONS[newRole]] }
          : u
      )
    );
  }

  const permissionsByCategory = ALL_PERMISSIONS.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    },
    {} as Record<string, typeof ALL_PERMISSIONS>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Personal</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Cargando..." : `${users.filter((u) => u.isActive).length} usuarios activos`} &middot;{" "}
            {tenant.nombre}
            {isFromApi && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                <Wifi className="h-3 w-3" /> API
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo Usuario
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-primary-200 bg-primary-50 p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Crear Usuario de Personal
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                required
                placeholder="Ej: María Lagos Muñoz"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                RUT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formRut}
                onChange={(e) => setFormRut(e.target.value)}
                required
                placeholder="12.345.678-9"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
                placeholder="usuario@establecimiento.cl"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            {isApiConnected && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  required={isApiConnected}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              tenant_id: {tenant.id} &middot; Se asignarán permisos por defecto según
              el rol
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isExpanded={editingId === user.id}
            onToggleExpand={() =>
              setEditingId(editingId === user.id ? null : user.id)
            }
            onToggleActive={() => toggleActive(user.id)}
            onChangeRole={(role) => changeRole(user.id, role)}
            onTogglePermission={(perm) => togglePermission(user.id, perm)}
            permissionsByCategory={permissionsByCategory}
          />
        ))}
      </div>
    </div>
  );
}

function UserCard({
  user,
  isExpanded,
  onToggleExpand,
  onToggleActive,
  onChangeRole,
  onTogglePermission,
  permissionsByCategory,
}: {
  user: User;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleActive: () => void;
  onChangeRole: (role: UserRole) => void;
  onTogglePermission: (perm: PermissionKey) => void;
  permissionsByCategory: Record<string, typeof ALL_PERMISSIONS>;
}) {
  const roleColor = getRoleColor(user.role);

  return (
    <div
      className={`rounded-xl border bg-white transition-shadow ${
        user.isActive ? "border-gray-200" : "border-gray-200 opacity-60"
      } ${isExpanded ? "shadow-md" : "hover:shadow-sm"}`}
    >
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${roleColor}`}
          >
            {user.nombreCompleto
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.nombreCompleto}</p>
            <p className="text-sm text-gray-500">
              {user.email} &middot; {user.rut}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${roleColor} text-white`}
          >
            {ROLE_LABELS[user.role]}
          </span>
          <button
            onClick={onToggleActive}
            className={`rounded-lg p-2 ${
              user.isActive
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-gray-400 hover:bg-gray-50"
            }`}
            title={user.isActive ? "Desactivar" : "Activar"}
          >
            {user.isActive ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onToggleExpand}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-5">
          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Cambiar Rol:</label>
            <select
              value={user.role}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400">
              Cambiar el rol reasignará los permisos por defecto
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-primary-600" />
            <h3 className="text-sm font-bold text-gray-900">
              Permisos Granulares
            </h3>
            <span className="text-xs text-gray-500">
              ({user.permissions.length}/{ALL_PERMISSIONS.length} activos)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(permissionsByCategory).map(([category, perms]) => (
              <div
                key={category}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {category}
                </h4>
                <div className="space-y-1.5">
                  {perms.map((perm) => {
                    const checked = user.permissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-white"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onTogglePermission(perm.key)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span
                          className={`text-xs ${
                            checked
                              ? "font-medium text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {perm.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    director: "bg-indigo-600",
    educadora: "bg-emerald-600",
    asistente: "bg-teal-500",
    fonoaudiologo: "bg-violet-600",
    psicologo: "bg-fuchsia-600",
    terapeuta_ocupacional: "bg-cyan-600",
    asistente_social: "bg-amber-600",
    medico: "bg-rose-600",
    nutricionista: "bg-lime-600",
    encargado_convivencia: "bg-orange-600",
    administrativo: "bg-slate-600",
    security_gate: "bg-gray-800",
    superadmin: "bg-yellow-600",
    sostenedor: "bg-yellow-700",
  };
  return colors[role];
}
