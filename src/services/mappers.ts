import type {
  Alumno, Curso, User, TenantConfig, TenantSaaS,
  NivelEducativo, Genero, UserRole, PermissionKey,
  GrupoSanguineo, Medicamento, MiembroFamilia,
  Apoderado, ContactoEmergencia, DatosSalud, Autorizaciones,
  AttendanceRecord, AttendanceStatus,
} from "@/types";
import { DEFAULT_PERMISSIONS } from "@/types";

// ─── Level Mapping ───

const LEVEL_API_TO_FRONT: Record<string, NivelEducativo> = {
  SALA_CUNA_MENOR: "sala_cuna_menor",
  SALA_CUNA_MAYOR: "sala_cuna_mayor",
  MEDIO_MENOR: "medio_menor",
  MEDIO_MAYOR: "medio_mayor",
  NT1: "transicion_menor",
  NT2: "transicion_mayor",
};

const LEVEL_FRONT_TO_API: Record<NivelEducativo, string> = {
  sala_cuna_menor: "SALA_CUNA_MENOR",
  sala_cuna_mayor: "SALA_CUNA_MAYOR",
  medio_menor: "MEDIO_MENOR",
  medio_mayor: "MEDIO_MAYOR",
  transicion_menor: "NT1",
  transicion_mayor: "NT2",
};

export { LEVEL_FRONT_TO_API };

// ─── Course ───

export function mapApiCourse(api: any): Curso {
  const assignedEducadora = api.assignments?.find(
    (a: any) => a.role === "EDUCADORA" || a.role === "educadora"
  );
  return {
    id: api.id,
    tenantId: api.tenantId,
    officialLevel: LEVEL_API_TO_FRONT[api.officialLevel] || "medio_menor",
    creativeName: api.creativeName || null,
    educadoraTitular: assignedEducadora?.user?.fullName || "",
    capacidad: api.capacity,
    anio: api.year,
    activo: api.isActive !== false,
  };
}

// ─── Student / Alumno ───

const GENDER_API_TO_FRONT: Record<string, Genero> = {
  MASCULINO: "masculino",
  FEMENINO: "femenino",
  OTRO: "otro",
};

const GENDER_FRONT_TO_API: Record<Genero, string> = {
  masculino: "MASCULINO",
  femenino: "FEMENINO",
  otro: "OTRO",
};

export { GENDER_FRONT_TO_API };

function mapHealthRecord(hr: any): DatosSalud {
  const defaultAuth: Autorizaciones = {
    primerosAuxilios: false,
    trasladoUrgencia: false,
    usoImagen: false,
    contactoUrgenciaNombre: "",
    contactoUrgenciaTelefono: "",
  };
  if (!hr) {
    return {
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
      autorizaciones: defaultAuth,
    };
  }
  return {
    condicionGeneral: hr.generalCondition || "",
    grupoSanguineo: (hr.bloodType as GrupoSanguineo) || "desconocido",
    alergias: hr.allergies || [],
    alergiasDetalle: hr.allergiesDetail || "",
    enfermedadesCronicas: hr.chronicConditions || [],
    medicamentos: (hr.medications || []).map((m: any): Medicamento => ({
      nombre: m.name,
      dosis: m.dose,
      frecuencia: m.frequency,
      horaAdministracion: m.adminTime,
      recetaAdjunta: m.prescriptionAttached || false,
    })),
    vacunasAlDia: hr.vaccinesUpToDate || false,
    antecedentes: hr.medicalHistory || "",
    observacionesMedicas: hr.observations || "",
    seguridadSocial: hr.healthInsurance || "",
    hospitalReferencia: hr.referralHospital || "",
    autorizaciones: {
      primerosAuxilios: hr.authFirstAid || false,
      trasladoUrgencia: hr.authEmergencyTransfer || false,
      usoImagen: hr.authImageUse || false,
      contactoUrgenciaNombre: hr.emergencyContactName || "",
      contactoUrgenciaTelefono: hr.emergencyContactPhone || "",
    },
  };
}

export function mapApiStudent(api: any): Alumno {
  const course = api.course;
  const level = course
    ? LEVEL_API_TO_FRONT[course.officialLevel] || "medio_menor"
    : "medio_menor";

  return {
    id: api.id,
    tenantId: api.tenantId,
    rut: api.rut,
    nombres: api.firstName,
    apellidoPaterno: api.lastName,
    apellidoMaterno: api.motherLastName,
    fechaNacimiento: api.birthDate?.split("T")[0] || "",
    genero: GENDER_API_TO_FRONT[api.gender] || "otro",
    nacionalidad: api.nationality || "Chilena",
    nivel: level,
    cursoId: api.courseId || null,
    estadoAsistencia: "presente",
    direccion: "",
    comuna: "",
    region: "",
    telefono: "",
    grupoFamiliar: (api.familyMembers || []).map((f: any): MiembroFamilia => ({
      nombre: f.name,
      parentesco: f.relationship,
      edad: f.age,
      viveConAlumno: f.livesWithStudent,
    })),
    salud: mapHealthRecord(api.healthRecord),
    apoderados: (api.guardians || []).map((g: any): Apoderado => ({
      id: g.id,
      rut: g.guardianRut,
      nombres: g.guardianName?.split(" ")[0] || "",
      apellidoPaterno: g.guardianName?.split(" ")[1] || "",
      apellidoMaterno: g.guardianName?.split(" ")[2] || "",
      parentesco: g.relationship as any || "otro",
      telefono: g.phone,
      email: g.email || "",
      direccion: "",
      comuna: "",
      ocupacion: "",
      esTitular: g.isPrimary,
    })),
    contactosEmergencia: (api.emergencyContacts || []).map((c: any): ContactoEmergencia => ({
      id: c.id,
      nombreCompleto: c.fullName,
      parentesco: c.relationship,
      telefono: c.phone,
      autorizadoRetirar: c.canPickup,
    })),
    codigoQR: api.qrCode || "",
    fechaMatricula: api.enrollmentDate?.split("T")[0] || "",
    activo: api.isActive !== false,
  };
}

// ─── User ───

const ROLE_API_TO_FRONT: Record<string, UserRole> = {
  SUPERADMIN: "superadmin",
  DIRECTOR: "director",
  EDUCADORA: "educadora",
  ASISTENTE: "asistente",
  FONOAUDIOLOGO: "fonoaudiologo",
  PSICOLOGO: "psicologo",
  TERAPEUTA_OCUPACIONAL: "terapeuta_ocupacional",
  ASISTENTE_SOCIAL: "asistente_social",
  MEDICO: "medico",
  NUTRICIONISTA: "nutricionista",
  ENCARGADO_CONVIVENCIA: "encargado_convivencia",
  ADMINISTRATIVO: "administrativo",
  SECURITY_GATE: "security_gate",
  SOSTENEDOR: "sostenedor",
};

const ROLE_FRONT_TO_API: Record<UserRole, string> = {
  superadmin: "SUPERADMIN",
  director: "DIRECTOR",
  educadora: "EDUCADORA",
  asistente: "ASISTENTE",
  fonoaudiologo: "FONOAUDIOLOGO",
  psicologo: "PSICOLOGO",
  terapeuta_ocupacional: "TERAPEUTA_OCUPACIONAL",
  asistente_social: "ASISTENTE_SOCIAL",
  medico: "MEDICO",
  nutricionista: "NUTRICIONISTA",
  encargado_convivencia: "ENCARGADO_CONVIVENCIA",
  administrativo: "ADMINISTRATIVO",
  security_gate: "SECURITY_GATE",
  sostenedor: "SOSTENEDOR",
};

export { ROLE_FRONT_TO_API };

export function mapApiUser(api: any): User {
  const role = ROLE_API_TO_FRONT[api.role] || "educadora";
  const permissionKeys = api.permissions?.map((p: any) => p.permissionKey) as PermissionKey[] | undefined;
  return {
    id: api.id,
    tenantId: api.tenantId,
    email: api.email,
    passwordHash: "",
    nombreCompleto: api.fullName,
    rut: api.rut || "",
    role,
    permissions: permissionKeys?.length ? permissionKeys : (DEFAULT_PERMISSIONS[role] || []),
    cursoAsignado: api.courseAssignments?.[0]?.courseId || null,
    isActive: api.isActive !== false,
    createdAt: api.createdAt || "",
  };
}

// ─── Tenant ───

const MODALITY_API_TO_FRONT: Record<string, string> = {
  JARDIN_INFANTIL: "jardin_infantil",
  ESCUELA_LENGUAJE: "escuela_lenguaje",
};

const PLAN_API_TO_FRONT: Record<string, string> = {
  BASICO: "basico",
  PROFESIONAL: "profesional",
  ENTERPRISE: "enterprise",
};

export function mapApiTenant(api: any): TenantConfig {
  return {
    id: api.id,
    nombre: api.name,
    rbd: api.rbd,
    direccion: api.address,
    comuna: api.comuna,
    region: api.region,
    telefono: api.phone,
    email: api.email,
    director: "",
    modalidad: (MODALITY_API_TO_FRONT[api.modality] || "jardin_infantil") as any,
    logoUrl: api.logoUrl || undefined,
  };
}

export function mapApiTenantSaaS(api: any): TenantSaaS {
  const counts = api._count || {};
  return {
    id: api.id,
    nombre: api.name,
    rbd: api.rbd,
    comuna: api.comuna,
    region: api.region,
    plan: (PLAN_API_TO_FRONT[api.plan] || "basico") as any,
    modulosActivos: (api.featureConfigs || [])
      .filter((f: any) => f.enabled)
      .map((f: any) => f.moduleKey),
    directorEmail: api.email,
    alumnosCount: counts.students || 0,
    personalCount: counts.users || 0,
    storageUsedMb: 0,
    createdAt: api.createdAt || "",
    isActive: api.isActive !== false,
  };
}

// ─── Attendance ───

const ATTENDANCE_API_TO_FRONT: Record<string, AttendanceStatus> = {
  PRESENT: "present",
  ABSENT: "absent",
  EXCUSED: "excused",
  LATE: "late",
};

export function mapApiAttendance(api: any): AttendanceRecord {
  return {
    id: api.id,
    tenantId: api.tenantId,
    studentId: api.studentId,
    cursoId: api.courseId,
    date: api.date?.split("T")[0] || "",
    status: ATTENDANCE_API_TO_FRONT[api.status] || "absent",
    checkInTime: api.checkInTime || null,
    registeredBy: api.registeredBy,
    registeredAt: api.registeredAt || "",
  };
}
