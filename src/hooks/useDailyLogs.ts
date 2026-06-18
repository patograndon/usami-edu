"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { dailyLogEntries as mockEntries } from "@/data/mock";
import type { DailyLogEntry } from "@/types";

export function useDailyLogs(courseId?: string) {
  const apiFn = useCallback(async (): Promise<DailyLogEntry[]> => {
    if (!courseId) return [];
    return api.getDailyLogsByCourse(courseId);
  }, [courseId]);

  const filtered = courseId
    ? mockEntries.filter((e) => e.cursoId === courseId)
    : mockEntries;

  return useApiData<DailyLogEntry[]>({
    apiFn,
    mockData: filtered,
  });
}
