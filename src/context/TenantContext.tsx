"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Modalidad, TenantConfig } from "@/types";
import { tenantConfig as defaultConfig } from "@/data/mock";
import { getAuthToken, getTenantById } from "@/services/api";
import { mapApiTenant } from "@/services/mappers";

interface TenantContextValue {
  tenant: TenantConfig;
  modalidad: Modalidad;
  setModalidad: (m: Modalidad) => void;
  esEscuelaLenguaje: boolean;
  modulosHabilitados: {
    fonoaudiologia: boolean;
    psicologia: boolean;
    diagnosticoClinico: boolean;
    decreto170: boolean;
  };
  loaded: boolean;
}

const TenantContext = createContext<TenantContextValue | null>(null);

const STORAGE_KEY = "usami_modalidad";

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig>(defaultConfig);
  const [modalidad, setModalidadState] = useState<Modalidad>(defaultConfig.modalidad);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "jardin_infantil" || stored === "escuela_lenguaje") {
      setModalidadState(stored);
    }
    setLoaded(true);

    const token = getAuthToken();
    if (token) {
      const userStr = localStorage.getItem("usami_user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.tenantId) {
            getTenantById(user.tenantId)
              .then((raw) => {
                const mapped = mapApiTenant(raw);
                setTenant(mapped);
                setModalidadState(mapped.modalidad);
              })
              .catch(() => {});
          }
        } catch {}
      }
    }
  }, []);

  const setModalidad = useCallback((m: Modalidad) => {
    setModalidadState(m);
    localStorage.setItem(STORAGE_KEY, m);
  }, []);

  const esEscuelaLenguaje = modalidad === "escuela_lenguaje";

  const modulosHabilitados = {
    fonoaudiologia: esEscuelaLenguaje,
    psicologia: esEscuelaLenguaje,
    diagnosticoClinico: esEscuelaLenguaje,
    decreto170: esEscuelaLenguaje,
  };

  return (
    <TenantContext.Provider
      value={{ tenant, modalidad, setModalidad, esEscuelaLenguaje, modulosHabilitados, loaded }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant debe usarse dentro de TenantProvider");
  return ctx;
}

export function useTenantId(): string {
  const { tenant } = useTenant();
  return tenant.id;
}
