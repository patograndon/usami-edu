"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { attendanceRecords as mockRecords } from "@/data/mock";
import type { AttendanceRecord } from "@/types";

export function useAttendanceByCourse(courseId: string, date?: string) {
  const apiFn = useCallback(async (): Promise<AttendanceRecord[]> => {
    return api.getAttendanceByCourse(courseId, date);
  }, [courseId, date]);

  const filtered = mockRecords.filter(
    (r) => r.cursoId === courseId && (!date || r.date === date)
  );

  return useApiData<AttendanceRecord[]>({
    apiFn,
    mockData: filtered,
  });
}
