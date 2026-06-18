"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { notifications as mockNotifications } from "@/data/mock";
import type { Notification } from "@/types";

export function useNotifications() {
  const apiFn = useCallback(async (): Promise<Notification[]> => {
    return api.getNotifications();
  }, []);

  return useApiData<Notification[]>({
    apiFn,
    mockData: mockNotifications,
  });
}
