"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { detailedAuditLogs as mockLogs } from "@/data/mock";
import type { DetailedAuditLog } from "@/types";

export function useAuditLogs() {
  const apiFn = useCallback(async (): Promise<DetailedAuditLog[]> => {
    return api.getAuditLogs();
  }, []);

  return useApiData<DetailedAuditLog[]>({
    apiFn,
    mockData: mockLogs,
  });
}
