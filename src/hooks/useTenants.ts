"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { mapApiTenantSaaS } from "@/services/mappers";
import { tenantsSaaS as mockTenants } from "@/data/mock";
import type { TenantSaaS } from "@/types";

export function useTenantsList() {
  const apiFn = useCallback(async (): Promise<TenantSaaS[]> => {
    const raw = await api.getTenants();
    return raw.map(mapApiTenantSaaS);
  }, []);

  return useApiData<TenantSaaS[]>({
    apiFn,
    mockData: mockTenants,
  });
}
