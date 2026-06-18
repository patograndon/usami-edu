"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { mapApiStudent } from "@/services/mappers";
import { alumnos as mockAlumnos } from "@/data/mock";
import type { Alumno } from "@/types";

export function useStudents(courseId?: string) {
  const apiFn = useCallback(async (): Promise<Alumno[]> => {
    const raw = await api.getStudents(courseId);
    return raw.map(mapApiStudent);
  }, [courseId]);

  return useApiData<Alumno[]>({
    apiFn,
    mockData: courseId
      ? mockAlumnos.filter((a) => a.cursoId === courseId)
      : mockAlumnos,
  });
}

export function useStudentById(id: string) {
  const apiFn = useCallback(async (): Promise<Alumno | null> => {
    const raw = await api.getStudentById(id);
    return mapApiStudent(raw);
  }, [id]);

  const mock = mockAlumnos.find((a) => a.id === id) || null;

  return useApiData<Alumno | null>({
    apiFn,
    mockData: mock,
  });
}
