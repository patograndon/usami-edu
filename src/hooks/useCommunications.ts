"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { communications as mockComms } from "@/data/mock";
import type { Communication } from "@/types";

export function useCommunications() {
  const apiFn = useCallback(async (): Promise<Communication[]> => {
    return api.getCommunications();
  }, []);

  return useApiData<Communication[]>({
    apiFn,
    mockData: mockComms,
  });
}
