"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";

export function useEvaluations(courseId?: string) {
  const apiFn = useCallback(async (): Promise<any[]> => {
    return api.getEvaluations(courseId);
  }, [courseId]);

  return useApiData<any[]>({
    apiFn,
    mockData: [],
  });
}
