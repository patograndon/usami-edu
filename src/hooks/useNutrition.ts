"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { menusSemanal as mockMenus } from "@/data/mock";
import type { MenuSemanal } from "@/types";

export function useMenus() {
  const apiFn = useCallback(async (): Promise<MenuSemanal[]> => {
    return api.getMenus();
  }, []);

  return useApiData<MenuSemanal[]>({
    apiFn,
    mockData: mockMenus,
  });
}
