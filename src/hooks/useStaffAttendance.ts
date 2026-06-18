"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { staffAttendanceRecords as mockRecords } from "@/data/mock";
import type { StaffAttendance } from "@/types";

export function useStaffAttendance(date?: string) {
  const apiFn = useCallback(async (): Promise<StaffAttendance[]> => {
    return api.getStaffAttendance(date);
  }, [date]);

  return useApiData<StaffAttendance[]>({
    apiFn,
    mockData: mockRecords,
  });
}
