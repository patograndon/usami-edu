"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { receipts as mockReceipts } from "@/data/mock";
import type { Receipt } from "@/types";

export function useReceipts() {
  const apiFn = useCallback(async (): Promise<Receipt[]> => {
    return api.getReceipts();
  }, []);

  return useApiData<Receipt[]>({
    apiFn,
    mockData: mockReceipts,
  });
}
