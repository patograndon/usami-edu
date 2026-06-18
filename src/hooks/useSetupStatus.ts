"use client";

import { useMemo } from "react";
import { cursos as mockCursos, alumnos as mockAlumnos } from "@/data/mock";
import { useTenant } from "@/context/TenantContext";
import type { Curso, Alumno } from "@/types";

export interface SetupStatus {
  schoolConfigured: boolean;
  coursesCreated: boolean;
  studentsRegistered: boolean;
  courseCount: number;
  studentCount: number;
  allComplete: boolean;
}

export function useSetupStatus(
  localCursos?: Curso[],
  localAlumnos?: Alumno[],
): SetupStatus {
  const { tenant } = useTenant();

  return useMemo(() => {
    const tenantCursos = (localCursos ?? mockCursos).filter(
      (c) => c.tenantId === tenant.id && c.activo
    );
    const tenantAlumnos = (localAlumnos ?? mockAlumnos).filter(
      (a) => a.tenantId === tenant.id && a.activo
    );

    const schoolConfigured = Boolean(tenant.nombre && tenant.rbd);
    const coursesCreated = tenantCursos.length > 0;
    const studentsRegistered = tenantAlumnos.length > 0;

    return {
      schoolConfigured,
      coursesCreated,
      studentsRegistered,
      courseCount: tenantCursos.length,
      studentCount: tenantAlumnos.length,
      allComplete: schoolConfigured && coursesCreated && studentsRegistered,
    };
  }, [tenant, localCursos, localAlumnos]);
}

export function validateCourseExists(
  courseId: string,
  tenantId: string,
  localCursos?: Curso[],
): { valid: boolean; error: string | null } {
  const available = (localCursos ?? mockCursos).filter(
    (c) => c.tenantId === tenantId && c.activo
  );

  if (available.length === 0) {
    return {
      valid: false,
      error: "No hay cursos creados. Debe configurar al menos un curso antes de matricular alumnos.",
    };
  }

  if (!courseId) {
    return {
      valid: false,
      error: "Debe seleccionar un curso para el alumno.",
    };
  }

  const exists = available.some((c) => c.id === courseId);
  if (!exists) {
    return {
      valid: false,
      error: `El curso seleccionado no existe o no pertenece a este establecimiento.`,
    };
  }

  return { valid: true, error: null };
}
