"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usuarios } from "@/data/mock";
import {
  login as apiLogin,
  setAuthToken,
  getAuthToken,
  logout as apiLogout,
} from "@/services/api";
import { mapApiUser } from "@/services/mappers";
import type { User, PermissionKey } from "@/types";
import { DEFAULT_PERMISSIONS } from "@/types";

interface AuthContextValue {
  currentUser: User;
  switchUser: (userId: string) => void;
  hasPermission: (key: PermissionKey) => boolean;
  hasAnyPermission: (keys: PermissionKey[]) => boolean;
  allUsers: User[];
  loginWithApi: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  isApiConnected: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(usuarios[0]);
  const [isApiConnected, setIsApiConnected] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsApiConnected(true);
      const stored = localStorage.getItem("usami_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {}
      }
    }
  }, []);

  const switchUser = useCallback((userId: string) => {
    const user = usuarios.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsApiConnected(false);
      apiLogout();
      localStorage.removeItem("usami_user");
    }
  }, []);

  const loginWithApi = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const response = await apiLogin(email, password);
        const role = response.user.role.toLowerCase() as User["role"];
        const permissions = DEFAULT_PERMISSIONS[role] || [];
        const apiUser: User = {
          id: response.user.id,
          tenantId: response.user.tenantId,
          email: response.user.email,
          passwordHash: "",
          nombreCompleto: response.user.fullName,
          rut: "",
          role,
          permissions,
          cursoAsignado: null,
          isActive: true,
          createdAt: "",
        };
        setCurrentUser(apiUser);
        setIsApiConnected(true);
        localStorage.setItem("usami_user", JSON.stringify(apiUser));
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const logoutUser = useCallback(() => {
    apiLogout();
    setIsApiConnected(false);
    setCurrentUser(usuarios[0]);
    localStorage.removeItem("usami_user");
  }, []);

  const hasPermission = useCallback(
    (key: PermissionKey) => currentUser.permissions.includes(key),
    [currentUser]
  );

  const hasAnyPermission = useCallback(
    (keys: PermissionKey[]) => keys.some((k) => currentUser.permissions.includes(k)),
    [currentUser]
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        hasPermission,
        hasAnyPermission,
        allUsers: usuarios.filter((u) => u.isActive),
        loginWithApi,
        logoutUser,
        isApiConnected,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
