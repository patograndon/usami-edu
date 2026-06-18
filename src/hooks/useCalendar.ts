"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { schoolEvents as mockEvents } from "@/data/mock";
import type { SchoolEvent } from "@/types";

export function useCalendarEvents() {
  const apiFn = useCallback(async (): Promise<SchoolEvent[]> => {
    return api.getEvents();
  }, []);

  return useApiData<SchoolEvent[]>({
    apiFn,
    mockData: mockEvents,
  });
}
