"use client";

import Link from "next/link";
import {
  CheckCircle,
  Circle,
  Lock,
  Building2,
  BookOpen,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import type { SetupStatus } from "@/hooks/useSetupStatus";

interface SetupWizardProps {
  status: SetupStatus;
}

export default function SetupWizard({ status }: SetupWizardProps) {
  if (status.allComplete) return null;

  const steps = [
    {
      label: "Configurar Escuela",
      description: "Nombre, RBD, dirección y modalidad del establecimiento",
      complete: status.schoolConfigured,
      blocked: false,
      href: "/configuracion",
      icon: Building2,
    },
    {
      label: "Crear Cursos",
      description: `Definir los cursos con nivel oficial y nombre creativo (${status.courseCount} creados)`,
      complete: status.coursesCreated,
      blocked: !status.schoolConfigured,
      href: "/cursos",
      icon: BookOpen,
    },
    {
      label: "Registrar Alumnos",
      description: `Matricular alumnos asignándolos a un curso (${status.studentCount} registrados)`,
      complete: status.studentsRegistered,
      blocked: !status.coursesCreated,
      href: "/alumnos",
      icon: UserPlus,
    },
  ];

  return (
    <div className="rounded-xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          Bienvenido a USAMI EDU Parvularia
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Complete los siguientes pasos para comenzar a usar el sistema.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const StepIcon = step.complete
            ? CheckCircle
            : step.blocked
              ? Lock
              : Circle;

          return (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                step.complete
                  ? "border-emerald-200 bg-emerald-50"
                  : step.blocked
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : "border-primary-200 bg-white shadow-sm"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  step.complete
                    ? "bg-emerald-200 text-emerald-700"
                    : step.blocked
                      ? "bg-gray-200 text-gray-400"
                      : "bg-primary-100 text-primary-600"
                }`}
              >
                <StepIcon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">
                    Paso {i + 1}
                  </span>
                  {step.complete && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Completado
                    </span>
                  )}
                </div>
                <p
                  className={`font-semibold ${
                    step.complete
                      ? "text-emerald-800"
                      : step.blocked
                        ? "text-gray-400"
                        : "text-gray-900"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>

              {!step.complete && !step.blocked && (
                <Link
                  href={step.href}
                  className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Ir
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

              {step.blocked && (
                <span className="text-xs text-gray-400">
                  Completa el paso anterior
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary-500 transition-all"
            style={{
              width: `${(steps.filter((s) => s.complete).length / steps.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs font-medium text-gray-500">
          {steps.filter((s) => s.complete).length}/{steps.length}
        </span>
      </div>
    </div>
  );
}
