"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { mapApiCourse } from "@/services/mappers";
import { cursos as mockCursos } from "@/data/mock";
import type { Curso } from "@/types";

export function useCourses() {
  const apiFn = useCallback(async (): Promise<Curso[]> => {
    const raw = await api.getCourses();
    return raw.map(mapApiCourse);
  }, []);

  return useApiData<Curso[]>({
    apiFn,
    mockData: mockCursos,
  });
}

export function useCourseById(id: string) {
  const apiFn = useCallback(async (): Promise<Curso | null> => {
    const raw = await api.getCourseById(id);
    return mapApiCourse(raw);
  }, [id]);

  const mock = mockCursos.find((c) => c.id === id) || null;

  return useApiData<Curso | null>({
    apiFn,
    mockData: mock,
  });
}
