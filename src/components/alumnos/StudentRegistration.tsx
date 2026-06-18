"use client";

import { useState } from "react";
import { X, Save, AlertTriangle } from "lucide-react";
import { cursos as mockCursos } from "@/data/mock";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import { validateCourseExists } from "@/hooks/useSetupStatus";
import { getCursoInformeName } from "@/types";
import { createStudent } from "@/services/api";
import { mapApiStudent, GENDER_FRONT_TO_API } from "@/services/mappers";
import type { Alumno, Curso, Genero, NivelEducativo, EstadoAsistencia } from "@/types";

interface StudentRegistrationProps {
  onClose: () => void;
  onSave: (alumno: Alumno) => void;
  availableCourses?: Curso[];
}

export default function StudentRegistration({ onClose, onSave, availableCourses }: StudentRegistrationProps) {
  const { tenant } = useTenant();
  const { isApiConnected } = useAuth();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    rut: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    genero: "masculino" as Genero,
    nacionalidad: "Chilena",
    cursoId: "",
    direccion: "",
    comuna: "",
    region: "Metropolitana",
    telefono: "",
    email: "",
  });

  const cursosActivos = (availableCourses ?? mockCursos).filter((c) => c.activo && c.tenantId === tenant.id);

  const cursoSeleccionado = cursosActivos.find((c) => c.id === form.cursoId);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (validationError) setValidationError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const courseValidation = validateCourseExists(form.cursoId, tenant.id, availableCourses);
    if (!courseValidation.valid) {
      setValidationError(courseValidation.error);
      return;
    }

    setSaving(true);

    if (isApiConnected) {
      try {
        const raw = await createStudent({
          rut: form.rut,
          firstName: form.nombres,
          lastName: form.apellidoPaterno,
          motherLastName: form.apellidoMaterno,
          birthDate: form.fechaNacimiento,
          gender: GENDER_FRONT_TO_API[form.genero],
          courseId: form.cursoId || undefined,
        });
        const mapped = mapApiStudent(raw);
        onSave(mapped);
      } catch (err: any) {
        setValidationError(err.message || "Error al crear alumno");
      } finally {
        setSaving(false);
      }
      return;
    }

    const nivel: NivelEducativo = cursoSeleccionado
      ? cursoSeleccionado.officialLevel
      : "medio_menor";

    const nuevo: Alumno = {
      id: `alu-${Date.now()}`,
      tenantId: tenant.id,
      rut: form.rut,
      nombres: form.nombres,
      apellidoPaterno: form.apellidoPaterno,
      apellidoMaterno: form.apellidoMaterno,
      fechaNacimiento: form.fechaNacimiento,
      genero: form.genero,
      nacionalidad: form.nacionalidad,
      nivel,
      cursoId: form.cursoId,
      estadoAsistencia: "presente" as EstadoAsistencia,
      direccion: form.direccion,
      comuna: form.comuna,
      region: form.region,
      telefono: form.telefono,
      email: form.email || undefined,
      grupoFamiliar: [],
      salud: {
        condicionGeneral: "",
        grupoSanguineo: "desconocido",
        alergias: [],
        alergiasDetalle: "",
        enfermedadesCronicas: [],
        medicamentos: [],
        vacunasAlDia: false,
        antecedentes: "",
        observacionesMedicas: "",
        seguridadSocial: "",
        hospitalReferencia: "",
        autorizaciones: {
          primerosAuxilios: false,
          trasladoUrgencia: false,
          usoImagen: false,
          contactoUrgenciaNombre: "",
          contactoUrgenciaTelefono: "",
        },
      },
      apoderados: [],
      contactosEmergencia: [],
      codigoQR: `QR-${form.rut.replace(/\./g, "").replace("-", "")}-2026`,
      fechaMatricula: new Date().toISOString().split("T")[0],
      activo: true,
    };

    setSaving(false);
    onSave(nuevo);
  }

  return (
    <div className="rounded-xl border border-primary-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Matricular Nuevo Alumno</h2>
          <p className="text-xs text-gray-500">
            Establecimiento: {tenant.nombre} &middot; ID: {tenant.id}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {validationError && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-gray-700">Identificación</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="RUT" name="rut" value={form.rut} onChange={handleChange} required placeholder="12.345.678-9" />
            <FormField label="Nombres" name="nombres" value={form.nombres} onChange={handleChange} required placeholder="Ej: Sofía Antonia" />
            <FormField label="Apellido Paterno" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} required />
            <FormField label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} required />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Género <span className="text-red-500">*</span>
              </label>
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <FormField label="Nacionalidad" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} required />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-gray-700">Asignación de Curso</legend>
          <div className="max-w-md">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Curso <span className="text-red-500">*</span>
            </label>
            <select
              name="cursoId"
              value={form.cursoId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Seleccionar curso...</option>
              {cursosActivos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {getCursoInformeName(curso)} — {curso.educadoraTitular}
                </option>
              ))}
            </select>
            {cursosActivos.length === 0 && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                No hay cursos creados. Debe configurar al menos un curso antes de matricular alumnos.
              </p>
            )}
            {cursoSeleccionado && (
              <p className="mt-1 text-xs text-gray-500">
                Educadora: {cursoSeleccionado.educadoraTitular}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-gray-700">Contacto</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} required />
            <FormField label="Comuna" name="comuna" value={form.comuna} onChange={handleChange} required />
            <FormField label="Región" name="region" value={form.region} onChange={handleChange} required />
            <FormField label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} required placeholder="+56 9 1234 5678" />
            <FormField label="Email" name="email" value={form.email} onChange={handleChange} placeholder="opcional@email.com" />
          </div>
        </fieldset>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-400">
            tenant_id: {tenant.id} (asignado automáticamente)
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cursosActivos.length === 0 || saving}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Guardando..." : "Matricular Alumno"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );
}
