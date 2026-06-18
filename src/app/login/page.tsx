"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn, Shield, User, BookOpen, Wifi, WifiOff } from "lucide-react";
import { usuarios } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/types";

type LoginType = "director" | "profesor" | "apoderado";

const LOGIN_TYPES: { id: LoginType; label: string; icon: typeof Shield; description: string }[] = [
  { id: "director", label: "Director / Admin", icon: Shield, description: "Acceso completo al sistema" },
  { id: "profesor", label: "Profesor / Personal", icon: BookOpen, description: "Gestión de aula y alumnos" },
  { id: "apoderado", label: "Apoderado", icon: User, description: "Seguimiento de su hijo/a" },
];

export default function LoginPage() {
  const router = useRouter();
  const { switchUser, loginWithApi, isApiConnected } = useAuth();

  const [loginType, setLoginType] = useState<LoginType>("director");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);

  const filteredUsers = usuarios.filter((u) => {
    if (loginType === "director") return u.role === "director" || u.role === "superadmin" || u.role === "sostenedor";
    if (loginType === "profesor") return ["educadora", "asistente", "fonoaudiologo", "psicologo", "medico", "nutricionista", "administrativo"].includes(u.role);
    return false;
  }).filter((u) => u.isActive);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (useApi) {
      const success = await loginWithApi(email, password);
      setLoading(false);
      if (!success) {
        setError("Credenciales inválidas o API no disponible.");
        return;
      }
      redirectByEmail(email);
    } else {
      setLoading(false);
      const user = usuarios.find((u) => u.email === email && u.isActive);
      if (!user) {
        setError("Credenciales inválidas. Verifique su email.");
        return;
      }
      switchUser(user.id);
      redirectByRole(user.role);
    }
  }

  function redirectByEmail(email: string) {
    if (email === "admin@usami.cl") router.push("/superadmin");
    else if (email === "sostenedor@usami.cl") router.push("/sostenedor");
    else router.push("/");
  }

  function redirectByRole(role: string) {
    if (role === "superadmin") router.push("/superadmin");
    else if (role === "sostenedor") router.push("/sostenedor");
    else router.push("/");
  }

  function handleQuickLogin(userId: string) {
    switchUser(userId);
    const user = usuarios.find((u) => u.id === userId);
    if (user) redirectByRole(user.role);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 text-white mb-4">
            <GraduationCap className="h-9 w-9" />
          </div>
          <h1 className="text-3xl font-bold text-white">USAMI EDU</h1>
          <p className="text-primary-300 text-sm mt-1">Parvularia — Sistema de Gestión Educacional</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="grid grid-cols-3 gap-2 flex-1">
              {LOGIN_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button key={type.id} onClick={() => { setLoginType(type.id); setError(""); }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                      loginType === type.id
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}>
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-semibold text-center leading-tight">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={() => setUseApi(!useApi)}
            className={`mb-4 flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium transition-colors ${
              useApi ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-500"
            }`}>
            {useApi ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {useApi ? "API Backend (PostgreSQL)" : "Modo Demo (datos locales)"}
          </button>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="usuario@establecimiento.cl" required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 active:scale-[0.98] disabled:opacity-50">
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? "Conectando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 mb-3 text-center">Acceso rápido (demo)</p>
            <div className="space-y-1.5">
              {filteredUsers.slice(0, 5).map((user) => (
                <button key={user.id} onClick={() => handleQuickLogin(user.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                    {user.nombreCompleto.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.nombreCompleto}</p>
                    <p className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-primary-400 mt-6">
          USAMI EDU Parvularia v0.1 · {useApi ? "Backend PostgreSQL" : "Modo Demo"}
        </p>
      </div>
    </div>
  );
}
