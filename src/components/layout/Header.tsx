"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/types";

export default function Header() {
  const { tenant, modalidad } = useTenant();
  const { currentUser, switchUser, allUsers } = useAuth();
  const [showUserPicker, setShowUserPicker] = useState(false);

  const modalidadLabel = modalidad === "escuela_lenguaje" ? "Escuela de Lenguaje" : "Jardín Infantil";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
      <div className="pl-14 lg:pl-0">
        <h2 className="text-lg font-semibold text-gray-900">{tenant.nombre}</h2>
        <p className="text-xs text-gray-500">RBD: {tenant.rbd} &middot; {tenant.comuna} &middot; {modalidadLabel}</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Search className="h-5 w-5" />
        </button>
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserPicker(!showUserPicker)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
          >
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
              {currentUser.nombreCompleto.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700">
                {currentUser.nombreCompleto.split(" ").slice(0, 2).join(" ")}
              </p>
              <p className="text-xs text-primary-600 font-medium">{ROLE_LABELS[currentUser.role]}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
          </button>

          {showUserPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserPicker(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                <p className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Cambiar usuario (demo)
                </p>
                {allUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id);
                      setShowUserPicker(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 ${
                      currentUser.id === user.id ? "bg-primary-50" : ""
                    }`}
                  >
                    <div className="h-8 w-8 shrink-0 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.nombreCompleto.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.nombreCompleto}</p>
                      <p className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
                    </div>
                    {currentUser.id === user.id && (
                      <span className="text-xs font-medium text-primary-600">Activo</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
