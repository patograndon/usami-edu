"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { securityLogs as mockLogs } from "@/data/mock";
import type { SecurityLog } from "@/types";

export function useSecurityLogs() {
  const apiFn = useCallback(async (): Promise<SecurityLog[]> => {
    return api.getSecurityLogs();
  }, []);

  return useApiData<SecurityLog[]>({
    apiFn,
    mockData: mockLogs,
  });
}

export function useRetirements() {
  const apiFn = useCallback(async (): Promise<any[]> => {
    return api.getRetirements();
  }, []);

  return useApiData<any[]>({
    apiFn,
    mockData: [],
  });
}
