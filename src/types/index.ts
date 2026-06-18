export type Modalidad = "jardin_infantil" | "escuela_lenguaje";

export type EstadoAsistencia = "presente" | "ausente" | "justificado" | "retirado";

export type Genero = "masculino" | "femenino" | "otro";

export type NivelEducativo =
  | "sala_cuna_menor"
  | "sala_cuna_mayor"
  | "medio_menor"
  | "medio_mayor"
  | "transicion_menor"
  | "transicion_mayor";

export interface Curso {
  id: string;
  tenantId: string;
  officialLevel: NivelEducativo;
  creativeName: string | null;
  educadoraTitular: string;
  capacidad: number;
  anio: number;
  activo: boolean;
}

export function getCursoDisplayName(curso: Curso): string {
  const oficial = NIVELES_LABELS[curso.officialLevel];
  if (!curso.creativeName) return oficial;
  return curso.creativeName;
}

export function getCursoInformeName(curso: Curso): string {
  const oficial = NIVELES_LABELS[curso.officialLevel];
  if (!curso.creativeName) return oficial;
  return `${curso.creativeName} (${oficial})`;
}

export type GrupoSanguineo = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "desconocido";

export type ParentescoApoderado =
  | "madre"
  | "padre"
  | "abuelo/a"
  | "tio/a"
  | "hermano/a"
  | "tutor_legal"
  | "otro";

export interface Apoderado {
  id: string;
  rut: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  parentesco: ParentescoApoderado;
  telefono: string;
  telefonoAlternativo?: string;
  email: string;
  direccion: string;
  comuna: string;
  ocupacion: string;
  lugarTrabajo?: string;
  esTitular: boolean;
}

export interface ContactoEmergencia {
  id: string;
  nombreCompleto: string;
  parentesco: string;
  telefono: string;
  telefonoAlternativo?: string;
  autorizadoRetirar: boolean;
}

export interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
  horaAdministracion: string;
  recetaAdjunta: boolean;
}

export interface Autorizaciones {
  primerosAuxilios: boolean;
  trasladoUrgencia: boolean;
  usoImagen: boolean;
  contactoUrgenciaNombre: string;
  contactoUrgenciaTelefono: string;
}

export interface DatosSalud {
  condicionGeneral: string;
  grupoSanguineo: GrupoSanguineo;
  alergias: string[];
  alergiasDetalle: string;
  enfermedadesCronicas: string[];
  medicamentos: Medicamento[];
  vacunasAlDia: boolean;
  antecedentes: string;
  observacionesMedicas: string;
  seguridadSocial: string;
  hospitalReferencia: string;
  autorizaciones: Autorizaciones;
}

export interface FichaFonoaudiologia {
  diagnostico: string;
  decreto170: boolean;
  nee: string;
  fechaIngreso: string;
  profesionalTratante: string;
  frecuenciaSesiones: string;
  observaciones: string;
}

export interface FichaPsicologia {
  diagnostico: string;
  fechaIngreso: string;
  profesionalTratante: string;
  frecuenciaSesiones: string;
  areasIntervenir: string[];
  observaciones: string;
}

export interface DiagnosticoClinico {
  diagnosticoPrincipal: string;
  cie10: string;
  fechaDiagnostico: string;
  profesionalDiagnostico: string;
  institucionDiagnostico: string;
  observaciones: string;
}

export interface MiembroFamilia {
  nombre: string;
  parentesco: string;
  edad: number;
  viveConAlumno: boolean;
}

export interface Alumno {
  id: string;
  tenantId: string;
  rut: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  genero: Genero;
  nacionalidad: string;
  nivel: NivelEducativo;
  cursoId: string | null;
  estadoAsistencia: EstadoAsistencia;
  fotoUrl?: string;

  direccion: string;
  comuna: string;
  region: string;
  telefono: string;
  email?: string;

  grupoFamiliar: MiembroFamilia[];

  salud: DatosSalud;
  diagnosticoClinico?: DiagnosticoClinico;
  fonoaudiologia?: FichaFonoaudiologia;
  psicologia?: FichaPsicologia;

  apoderados: Apoderado[];
  contactosEmergencia: ContactoEmergencia[];

  codigoQR: string;
  fechaMatricula: string;
  activo: boolean;
}

export interface KpiData {
  label: string;
  valor: number;
  total?: number;
  icono: string;
  color: "success" | "danger" | "warning" | "primary";
}

export interface TenantConfig {
  id: string;
  nombre: string;
  rbd: string;
  direccion: string;
  comuna: string;
  region: string;
  telefono: string;
  email: string;
  director: string;
  modalidad: Modalidad;
  logoUrl?: string;
}

export const NIVELES_LABELS: Record<NivelEducativo, string> = {
  sala_cuna_menor: "Sala Cuna Menor",
  sala_cuna_mayor: "Sala Cuna Mayor",
  medio_menor: "Medio Menor",
  medio_mayor: "Medio Mayor",
  transicion_menor: "Primer Nivel Transición",
  transicion_mayor: "Segundo Nivel Transición",
};

export const ESTADO_LABELS: Record<EstadoAsistencia, string> = {
  presente: "Presente",
  ausente: "Ausente",
  justificado: "Justificado",
  retirado: "Retirado",
};

// ─── Users, Roles & Permisos ───

export type UserRole =
  | "director"
  | "educadora"
  | "asistente"
  | "fonoaudiologo"
  | "psicologo"
  | "terapeuta_ocupacional"
  | "asistente_social"
  | "medico"
  | "nutricionista"
  | "encargado_convivencia"
  | "administrativo"
  | "security_gate"
  | "superadmin"
  | "sostenedor";

export const ROLE_LABELS: Record<UserRole, string> = {
  director: "Director/a",
  educadora: "Educadora de Párvulos",
  asistente: "Asistente de Párvulos",
  fonoaudiologo: "Fonoaudiólogo/a",
  psicologo: "Psicólogo/a",
  terapeuta_ocupacional: "Terapeuta Ocupacional",
  asistente_social: "Asistente Social",
  medico: "Médico",
  nutricionista: "Nutricionista",
  encargado_convivencia: "Encargado/a Convivencia Escolar",
  administrativo: "Administrativo/Secretaría",
  security_gate: "Tablet de Acceso (Portería)",
  superadmin: "Superadministrador SaaS",
  sostenedor: "Sostenedor / Representante Legal",
};

export type PermissionKey =
  | "alumnos.ver"
  | "alumnos.crear"
  | "alumnos.editar"
  | "alumnos.eliminar"
  | "fichas.ver_identificacion"
  | "fichas.ver_contacto"
  | "fichas.ver_familia"
  | "fichas.ver_salud"
  | "fichas.ver_apoderados"
  | "fichas.ver_emergencia"
  | "fichas.ver_qr"
  | "fichas.editar_salud"
  | "fichas.editar_diagnostico"
  | "fichas.editar_fonoaudiologia"
  | "fichas.editar_psicologia"
  | "cursos.ver"
  | "cursos.crear"
  | "cursos.editar"
  | "informes.ver"
  | "informes.generar"
  | "personal.ver"
  | "personal.gestionar"
  | "asistencia.ver"
  | "asistencia.registrar"
  | "asistencia.retiro"
  | "diario.registrar"
  | "diario.aprobar"
  | "diario.auditar"
  | "d170.ver"
  | "d170.sesiones"
  | "d170.auditar"
  | "calendario.ver"
  | "calendario.crear"
  | "reportes.ver"
  | "comunicaciones.ver"
  | "comunicaciones.crear"
  | "menus.ver"
  | "menus.crear"
  | "rrhh.ver"
  | "rrhh.checkin"
  | "finanzas.ver"
  | "finanzas.crear"
  | "seguridad.ver"
  | "seguridad.registrar"
  | "seguridad.emergencia"
  | "notificaciones.ver"
  | "notificaciones.enviar"
  | "chat.ver"
  | "chat.enviar"
  | "mineduc.exportar"
  | "billing.ver"
  | "auditlog.ver"
  | "configuracion.ver"
  | "configuracion.editar";

export interface Permission {
  key: PermissionKey;
  label: string;
  category: string;
}

export const ALL_PERMISSIONS: Permission[] = [
  { key: "alumnos.ver", label: "Ver listado de alumnos", category: "Alumnos" },
  { key: "alumnos.crear", label: "Matricular alumnos", category: "Alumnos" },
  { key: "alumnos.editar", label: "Editar datos de alumnos", category: "Alumnos" },
  { key: "alumnos.eliminar", label: "Eliminar alumnos", category: "Alumnos" },
  { key: "fichas.ver_identificacion", label: "Ver identificación", category: "Fichas" },
  { key: "fichas.ver_contacto", label: "Ver contacto", category: "Fichas" },
  { key: "fichas.ver_familia", label: "Ver grupo familiar", category: "Fichas" },
  { key: "fichas.ver_salud", label: "Ver datos de salud", category: "Fichas" },
  { key: "fichas.ver_apoderados", label: "Ver apoderados", category: "Fichas" },
  { key: "fichas.ver_emergencia", label: "Ver emergencia", category: "Fichas" },
  { key: "fichas.ver_qr", label: "Ver código QR", category: "Fichas" },
  { key: "fichas.editar_salud", label: "Editar datos de salud", category: "Fichas" },
  { key: "fichas.editar_diagnostico", label: "Editar diagnóstico clínico", category: "Fichas" },
  { key: "fichas.editar_fonoaudiologia", label: "Editar ficha fonoaudiológica", category: "Fichas" },
  { key: "fichas.editar_psicologia", label: "Editar ficha psicológica", category: "Fichas" },
  { key: "cursos.ver", label: "Ver cursos", category: "Cursos" },
  { key: "cursos.crear", label: "Crear cursos", category: "Cursos" },
  { key: "cursos.editar", label: "Editar cursos", category: "Cursos" },
  { key: "asistencia.ver", label: "Ver asistencia", category: "Asistencia" },
  { key: "asistencia.registrar", label: "Registrar asistencia diaria", category: "Asistencia" },
  { key: "asistencia.retiro", label: "Autorizar retiros QR", category: "Asistencia" },
  { key: "diario.registrar", label: "Registrar en diario de aula", category: "Diario de Aula" },
  { key: "diario.aprobar", label: "Aprobar registros (Visto Bueno)", category: "Diario de Aula" },
  { key: "diario.auditar", label: "Auditar diario (vista global)", category: "Diario de Aula" },
  { key: "d170.ver", label: "Ver registros Decreto 170", category: "Decreto 170" },
  { key: "d170.sesiones", label: "Registrar sesiones especialista", category: "Decreto 170" },
  { key: "d170.auditar", label: "Auditoría Decreto 170", category: "Decreto 170" },
  { key: "calendario.ver", label: "Ver calendario", category: "Calendario" },
  { key: "calendario.crear", label: "Crear eventos", category: "Calendario" },
  { key: "reportes.ver", label: "Ver reportes", category: "Reportes" },
  { key: "informes.ver", label: "Ver informes", category: "Informes" },
  { key: "informes.generar", label: "Generar informes", category: "Informes" },
  { key: "personal.ver", label: "Ver personal", category: "Personal" },
  { key: "personal.gestionar", label: "Gestionar personal y permisos", category: "Personal" },
  { key: "comunicaciones.ver", label: "Ver comunicaciones", category: "Comunicaciones" },
  { key: "comunicaciones.crear", label: "Crear circulares/encuestas", category: "Comunicaciones" },
  { key: "menus.ver", label: "Ver menú semanal", category: "Nutrición" },
  { key: "menus.crear", label: "Gestionar menús", category: "Nutrición" },
  { key: "rrhh.ver", label: "Ver asistencia personal", category: "RRHH" },
  { key: "rrhh.checkin", label: "Registrar entrada/salida", category: "RRHH" },
  { key: "finanzas.ver", label: "Ver recibos/pagos", category: "Finanzas" },
  { key: "finanzas.crear", label: "Emitir recibos", category: "Finanzas" },
  { key: "seguridad.ver", label: "Ver bitácora de seguridad", category: "Seguridad" },
  { key: "seguridad.registrar", label: "Registrar ingreso/egreso (Tablet)", category: "Seguridad" },
  { key: "seguridad.emergencia", label: "Registro de emergencia (Director)", category: "Seguridad" },
  { key: "notificaciones.ver", label: "Ver centro de notificaciones", category: "Notificaciones" },
  { key: "notificaciones.enviar", label: "Enviar notificaciones", category: "Notificaciones" },
  { key: "chat.ver", label: "Ver conversaciones", category: "Chat" },
  { key: "chat.enviar", label: "Enviar mensajes", category: "Chat" },
  { key: "mineduc.exportar", label: "Exportar reportes MINEDUC", category: "MINEDUC" },
  { key: "billing.ver", label: "Gestión de suscripciones", category: "Facturación" },
  { key: "auditlog.ver", label: "Ver log de auditoría", category: "Auditoría" },
  { key: "configuracion.ver", label: "Ver configuración", category: "Configuración" },
  { key: "configuracion.editar", label: "Editar configuración", category: "Configuración" },
];

export const DEFAULT_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  director: ALL_PERMISSIONS.map((p) => p.key).filter((k) => k !== "billing.ver" && k !== "auditlog.ver"),
  educadora: [
    "alumnos.ver", "alumnos.editar",
    "fichas.ver_identificacion", "fichas.ver_contacto", "fichas.ver_familia",
    "fichas.ver_salud", "fichas.ver_apoderados", "fichas.ver_emergencia", "fichas.ver_qr",
    "cursos.ver",
    "asistencia.ver", "asistencia.registrar", "asistencia.retiro",
    "diario.registrar", "diario.aprobar",
    "calendario.ver", "reportes.ver",
    "comunicaciones.ver", "menus.ver", "rrhh.checkin",
    "seguridad.ver", "notificaciones.enviar",
    "chat.ver", "chat.enviar",
    "informes.ver",
  ],
  asistente: [
    "alumnos.ver",
    "fichas.ver_identificacion", "fichas.ver_contacto", "fichas.ver_emergencia", "fichas.ver_qr",
    "cursos.ver",
    "asistencia.ver", "asistencia.registrar", "asistencia.retiro",
    "diario.registrar",
    "calendario.ver", "comunicaciones.ver", "menus.ver", "rrhh.checkin",
    "seguridad.ver",
  ],
  fonoaudiologo: [
    "alumnos.ver",
    "fichas.ver_identificacion", "fichas.ver_salud",
    "fichas.editar_salud", "fichas.editar_fonoaudiologia",
    "d170.ver", "d170.sesiones",
    "informes.ver", "informes.generar",
  ],
  psicologo: [
    "alumnos.ver",
    "fichas.ver_identificacion", "fichas.ver_salud", "fichas.ver_familia",
    "fichas.editar_salud", "fichas.editar_psicologia",
    "d170.ver", "d170.sesiones",
    "informes.ver", "informes.generar",
  ],
  terapeuta_ocupacional: [
    "alumnos.ver",
    "fichas.ver_identificacion", "fichas.ver_salud",
    "fichas.editar_salud",
    "d170.ver", "d170.sesiones",
    "informes.ver",
  ],
  asistente_social: [
    "alumnos.ver",
    "fichas.ver_identificacion", "fichas.ver_contacto", "fichas.ver_familia",
    "fichas.ver_apoderados", "fichas.ver_emergencia",
    "informes.ver",
  ],
  medico: [
    "alumnos.ver",
    "fichas.ver_identificacion", "fichas.ver_salud",
    "fichas.editar_salud", "fichas.editar_diagnostico",
    "informes.ver", "informes.generar",
  ],
  nutricionista: [
    "alumnos.ver",
    "fichas.ver_identificacion", "fichas.ver_salud",
    "fichas.editar_salud",
    "cursos.ver",
    "informes.ver",
  ],
  encargado_convivencia: [
    "alumnos.ver",
    "fichas.ver_identificacion", "fichas.ver_contacto", "fichas.ver_familia",
    "fichas.ver_apoderados", "fichas.ver_emergencia",
    "informes.ver", "informes.generar",
  ],
  administrativo: [
    "alumnos.ver", "alumnos.crear",
    "fichas.ver_identificacion", "fichas.ver_contacto", "fichas.ver_apoderados",
    "cursos.ver",
  ],
  security_gate: [
    "seguridad.registrar",
  ],
  superadmin: ALL_PERMISSIONS.map((p) => p.key),
  sostenedor: ALL_PERMISSIONS.map((p) => p.key),
};

export interface User {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  nombreCompleto: string;
  rut: string;
  role: UserRole;
  permissions: PermissionKey[];
  cursoAsignado: string | null;
  isActive: boolean;
  createdAt: string;
}

// ─── Asistencia y Retiro QR ───

export type AttendanceStatus = "present" | "absent" | "excused" | "late";

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: "Presente",
  absent: "Ausente",
  excused: "Justificado",
  late: "Atrasado",
};

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  studentId: string;
  cursoId: string;
  date: string;
  status: AttendanceStatus;
  checkInTime: string | null;
  registeredBy: string;
  registeredAt: string;
}

export interface RetirementLog {
  id: string;
  tenantId: string;
  studentId: string;
  authorizedByUserId: string;
  retireeName: string;
  retireeRut: string;
  retireeParentesco: string;
  timestamp: string;
  qrCodeHashVerification: string;
  verified: boolean;
}

export interface AuthorizedRetiree {
  id: string;
  studentId: string;
  nombreCompleto: string;
  rut: string;
  parentesco: string;
  telefono: string;
  fotoUrl?: string;
  qrHash: string;
  activo: boolean;
}

export interface AttendanceAlert {
  studentId: string;
  studentName: string;
  cursoId: string;
  consecutiveAbsences: number;
  lastAbsenceDate: string;
  type: "warning" | "critical";
}

// ─── Diario de Aula ───

export type DailyLogCategory = "comida" | "siesta" | "higiene" | "actividad" | "observacion";

export const DAILY_LOG_CATEGORY_LABELS: Record<DailyLogCategory, string> = {
  comida: "Alimentación",
  siesta: "Siesta / Descanso",
  higiene: "Higiene / Muda",
  actividad: "Actividad Pedagógica",
  observacion: "Observación General",
};

export type ComidaTipo = "desayuno" | "almuerzo" | "once" | "colacion";
export type ComidaCantidad = "todo" | "casi_todo" | "mitad" | "poco" | "nada";
export type SiestaCalidad = "profunda" | "intermitente" | "no_durmio";
export type HigieneTipo = "muda" | "bano" | "lavado_manos" | "cambio_ropa";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface DailyLogEntry {
  id: string;
  tenantId: string;
  studentId: string;
  cursoId: string;
  date: string;
  category: DailyLogCategory;
  timestamp: string;
  registeredBy: string;
  registeredByRole: UserRole;
  approvalStatus: ApprovalStatus;
  approvedBy: string | null;
  approvedAt: string | null;

  comida?: { tipo: ComidaTipo; cantidad: ComidaCantidad; observacion?: string };
  siesta?: { inicio: string; fin: string; calidad: SiestaCalidad; observacion?: string };
  higiene?: { tipo: HigieneTipo; observacion?: string };
  actividad?: { descripcion: string; participacion: "activa" | "pasiva" | "no_participo" };
  observacion?: { texto: string };
}

export const COMIDA_LABELS: Record<ComidaTipo, string> = {
  desayuno: "Desayuno",
  almuerzo: "Almuerzo",
  once: "Once",
  colacion: "Colación",
};

export const CANTIDAD_LABELS: Record<ComidaCantidad, string> = {
  todo: "Comió todo",
  casi_todo: "Casi todo",
  mitad: "La mitad",
  poco: "Poco",
  nada: "No comió",
};

export const SIESTA_LABELS: Record<SiestaCalidad, string> = {
  profunda: "Sueño profundo",
  intermitente: "Sueño intermitente",
  no_durmio: "No durmió",
};

export const HIGIENE_LABELS: Record<HigieneTipo, string> = {
  muda: "Muda / Cambio pañal",
  bano: "Fue al baño",
  lavado_manos: "Lavado de manos",
  cambio_ropa: "Cambio de ropa",
};

export const APPROVAL_LABELS: Record<ApprovalStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

export const TAB_PERMISSION_MAP: Record<string, PermissionKey> = {
  identificacion: "fichas.ver_identificacion",
  contacto: "fichas.ver_contacto",
  familia: "fichas.ver_familia",
  salud: "fichas.ver_salud",
  apoderados: "fichas.ver_apoderados",
  emergencia: "fichas.ver_emergencia",
  qr: "fichas.ver_qr",
};

// ─── Decreto 170 ───

export type SessionType = "individual" | "grupal";

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  individual: "Individual",
  grupal: "Grupal",
};

export type LogroNivel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const LOGRO_LABELS: Record<LogroNivel, string> = {
  1: "No observado",
  2: "No logrado",
  3: "Iniciado",
  4: "En desarrollo",
  5: "Logrado con apoyo",
  6: "Logrado",
  7: "Consolidado",
};

export type NeeType = "transitoria" | "permanente";

export const NEE_LABELS: Record<NeeType, string> = {
  transitoria: "NEE Transitoria",
  permanente: "NEE Permanente",
};

export interface FueiRecord {
  id: string;
  tenantId: string;
  studentId: string;
  anio: number;

  rbd: string;
  nombreEstablecimiento: string;
  regionEstablecimiento: string;
  comunaEstablecimiento: string;

  rutAlumno: string;
  nombreAlumno: string;
  fechaNacimientoAlumno: string;
  generoAlumno: string;
  nivelAlumno: string;
  cursoAlumno: string;

  neeType: NeeType;
  diagnosticoCie10: string;
  diagnosticoDescripcion: string;
  fechaDeteccion: string;
  profesionalEvaluador: string;
  rutProfesional: string;
  especialidadProfesional: string;

  apoyosEspecializados: string[];
  recursosAdicionales: string;
  adecuacionesCurriculares: string;

  fechaIngresoPie: string;
  fechaReevaluacion: string;

  nombreApoderado: string;
  rutApoderado: string;
  firmaApoderado: boolean;

  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Decreto170Record {
  id: string;
  tenantId: string;
  studentId: string;
  fueiId: string | null;
  fueiUrl: string | null;
  diagnosticoCie10: string;
  diagnosticoDescripcion: string;
  neeType: NeeType;
  fechaEvaluacion: string;
  fechaIngresoPie: string;
  fechaVencimientoReevaluacion: string;
  profesionalEvaluador: string;
  locked: boolean;
}

export interface SpecialistSession {
  id: string;
  tenantId: string;
  studentId: string;
  specialistId: string;
  specialistRole: "fonoaudiologo" | "psicologo" | "terapeuta_ocupacional";
  type: SessionType;
  date: string;
  durationMinutes: number;
  objetivoTrabajado: string;
  actividadResumen: string;
  nivelLogro: LogroNivel;
  observaciones: string;
  locked: boolean;
  createdAt: string;
}

export interface Decreto170Alert {
  studentId: string;
  studentName: string;
  diagnostico: string;
  neeType: NeeType;
  fechaVencimiento: string;
  diasRestantes: number;
  urgencia: "critico" | "urgente" | "proximo";
  semaforo: "rojo" | "naranja" | "amarillo" | "verde";
}

export function calcularFechaReevaluacion(fechaIngreso: string): string {
  const d = new Date(fechaIngreso);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

// ─── Calendario y Eventos ───

export type EventType = "reunion" | "actividad_escolar" | "hito" | "feriado";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  reunion: "Reunión",
  actividad_escolar: "Actividad Escolar",
  hito: "Hito",
  feriado: "Feriado",
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  reunion: "bg-blue-500",
  actividad_escolar: "bg-emerald-500",
  hito: "bg-violet-500",
  feriado: "bg-red-500",
};

export interface SchoolEvent {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: EventType;
  cursoId: string | null;
  isPublic: boolean;
  createdBy: string;
}

// ─── Comunicaciones ───

export type CommunicationType = "circular" | "encuesta";
export type TargetAudience = "todos" | "curso";

export const COMM_TYPE_LABELS: Record<CommunicationType, string> = {
  circular: "Circular",
  encuesta: "Encuesta",
};

export interface SurveyQuestion {
  id: string;
  pregunta: string;
  opciones: string[];
  respuestas: Record<string, number>;
}

export interface Communication {
  id: string;
  tenantId: string;
  title: string;
  body: string;
  type: CommunicationType;
  targetAudience: TargetAudience;
  targetCursoId: string | null;
  questions: SurveyQuestion[];
  publishedAt: string;
  createdBy: string;
  isRead: boolean;
}

// ─── Menús y Nutrición ───

export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes";

export const DIA_LABELS: Record<DiaSemana, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
};

export interface MenuDia {
  dia: DiaSemana;
  desayuno: string;
  almuerzo: string;
  once: string;
  colacion: string;
}

export interface MenuSemanal {
  id: string;
  tenantId: string;
  semanaInicio: string;
  semanaFin: string;
  cursoId: string | null;
  dias: MenuDia[];
  createdBy: string;
  createdAt: string;
}

// ─── RRHH — Control de Horario ───

export type CheckType = "entrada" | "salida";

export interface StaffAttendance {
  id: string;
  tenantId: string;
  userId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  method: "qr" | "web";
  horasTrabajadas: number | null;
}

// ─── Finanzas (Estructura Preliminar) ───

export type PaymentStatus = "pendiente" | "pagado" | "vencido" | "anulado";
export type ReceiptType = "matricula" | "mensualidad" | "material" | "otro";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  vencido: "Vencido",
  anulado: "Anulado",
};

export const RECEIPT_TYPE_LABELS: Record<ReceiptType, string> = {
  matricula: "Matrícula",
  mensualidad: "Mensualidad",
  material: "Material Educativo",
  otro: "Otro",
};

export interface Receipt {
  id: string;
  tenantId: string;
  studentId: string;
  type: ReceiptType;
  description: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  status: PaymentStatus;
  folio: string;
  createdBy: string;
}

// ─── Registro Seguro (Ingreso/Egreso) ───

export type SecurityLogType = "entry" | "exit";
export type SecurityRole = "staff" | "parent" | "visitor";
export type SecurityStatus = "ingreso" | "retiro" | "retiro_alumno";

export const SECURITY_TYPE_LABELS: Record<SecurityLogType, string> = {
  entry: "Ingreso",
  exit: "Salida",
};

export const SECURITY_ROLE_LABELS: Record<SecurityRole, string> = {
  staff: "Personal",
  parent: "Apoderado",
  visitor: "Visitante",
};

export interface SecurityLog {
  id: string;
  tenantId: string;
  personId: string;
  personName: string;
  personRut: string;
  type: SecurityLogType;
  role: SecurityRole;
  photoUrl: string;
  timestamp: string;
  method: "qr" | "manual" | "web";
  relatedStudentId: string | null;
  relatedStudentName: string | null;
  verifiedAgainstAuthorized: boolean;
  registeredBy: string;
}

// ─── Notificaciones (Push Engine) ───

export type NotificationEvent =
  | "checkout_student"
  | "new_circular"
  | "new_survey"
  | "emergency_alert"
  | "attendance_alert"
  | "d170_reevaluation"
  | "event_reminder";

export type NotificationPriority = "high" | "normal";

export type NotificationStatus = "sent" | "delivered" | "read" | "failed";

export const NOTIFICATION_EVENT_LABELS: Record<NotificationEvent, string> = {
  checkout_student: "Retiro de Alumno",
  new_circular: "Nueva Circular",
  new_survey: "Nueva Encuesta",
  emergency_alert: "Alerta de Emergencia",
  attendance_alert: "Alerta de Inasistencia",
  d170_reevaluation: "Reevaluación D170",
  event_reminder: "Recordatorio de Evento",
};

export const NOTIFICATION_PRIORITY_CONFIG: Record<NotificationPriority, { label: string; color: string }> = {
  high: { label: "Alta", color: "bg-red-100 text-red-700" },
  normal: { label: "Normal", color: "bg-blue-100 text-blue-700" },
};

export const EVENT_PRIORITY_MAP: Record<NotificationEvent, NotificationPriority> = {
  checkout_student: "high",
  emergency_alert: "high",
  attendance_alert: "high",
  d170_reevaluation: "normal",
  new_circular: "normal",
  new_survey: "normal",
  event_reminder: "normal",
};

export interface Notification {
  id: string;
  tenantId: string;
  event: NotificationEvent;
  priority: NotificationPriority;
  title: string;
  body: string;
  recipientUserId: string | null;
  recipientRole: string | null;
  relatedEntityId: string | null;
  status: NotificationStatus;
  sentAt: string;
  readAt: string | null;
}

export type DeviceType = "android" | "ios" | "web";

export interface DeviceToken {
  id: string;
  userId: string;
  fcmToken: string;
  deviceType: DeviceType;
  lastUpdated: string;
  active: boolean;
}

// ─── Notificaciones Inteligentes (Plantillas) ───

export type NotificationCategory = "salud" | "logistica" | "pedagogico" | "solicitudes";

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  salud: "Salud y Bienestar",
  logistica: "Logística y Retiros",
  pedagogico: "Pedagógico",
  solicitudes: "Solicitudes",
};

export const NOTIFICATION_CATEGORY_COLORS: Record<NotificationCategory, { bg: string; text: string; icon: string }> = {
  salud: { bg: "bg-red-100", text: "text-red-700", icon: "bg-red-200 text-red-600" },
  logistica: { bg: "bg-blue-100", text: "text-blue-700", icon: "bg-blue-200 text-blue-600" },
  pedagogico: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "bg-emerald-200 text-emerald-600" },
  solicitudes: { bg: "bg-violet-100", text: "text-violet-700", icon: "bg-violet-200 text-violet-600" },
};

export interface NotificationTemplate {
  id: string;
  category: NotificationCategory;
  title: string;
  messageBody: string;
  variables: string[];
}

export interface SmartNotification {
  id: string;
  tenantId: string;
  templateId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  body: string;
  recipientStudentId: string | null;
  recipientStudentName: string | null;
  sentBy: string;
  sentByRole: UserRole;
  sentAt: string;
  status: NotificationStatus;
}

export function renderTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

// ─── Chat / Mensajería Instantánea ───

export type MessageStatus = "sent" | "delivered" | "read";

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  sent: "Enviado",
  delivered: "Entregado",
  read: "Leído",
};

export interface ChatConversation {
  id: string;
  tenantId: string;
  participantIds: string[];
  participantNames: string[];
  participantRoles: string[];
  relatedStudentId: string | null;
  relatedStudentName: string | null;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  tenantId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  body: string;
  imageUrl: string | null;
  imageCompressed: boolean;
  status: MessageStatus;
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
}

// ─── SaaS / Superadmin ───

export type SubscriptionPlan = "basico" | "profesional" | "enterprise";

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  basico: "Básico",
  profesional: "Profesional",
  enterprise: "Enterprise",
};

export interface TenantSaaS {
  id: string;
  nombre: string;
  rbd: string;
  comuna: string;
  region: string;
  plan: SubscriptionPlan;
  modulosActivos: string[];
  directorEmail: string;
  alumnosCount: number;
  personalCount: number;
  storageUsedMb: number;
  createdAt: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: string;
  detail: string;
  timestamp: string;
  ip: string;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  subject: string;
  description: string;
  status: "abierto" | "en_progreso" | "resuelto";
  createdAt: string;
  createdBy: string;
}

// ─── Consola Sostenedor ───

export type PayrollStatus = "borrador" | "visado_director" | "aprobado" | "pagado";
export type LeaveRequestStatus = "solicitado" | "visado_director" | "aprobado_sostenedor" | "rechazado";
export type LeaveType = "permiso_personal" | "licencia_medica" | "vacaciones" | "capacitacion";

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  permiso_personal: "Permiso Personal",
  licencia_medica: "Licencia Médica",
  vacaciones: "Vacaciones",
  capacitacion: "Capacitación",
};

export const LEAVE_STATUS_LABELS: Record<LeaveRequestStatus, string> = {
  solicitado: "Solicitado",
  visado_director: "Visado por Director",
  aprobado_sostenedor: "Aprobado",
  rechazado: "Rechazado",
};

export interface Liquidacion {
  id: string;
  tenantId: string;
  userId: string;
  periodo: string;
  sueldoBase: number;
  bonos: number;
  descuentos: number;
  totalLiquido: number;
  status: PayrollStatus;
  visadoPorDirector: boolean;
  pdfUrl: string | null;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveRequestStatus;
  directorApproval: boolean | null;
  directorComment: string | null;
  sostenedorApproval: boolean | null;
  replacementName: string | null;
  createdAt: string;
}

export interface SedeMetrics {
  tenantId: string;
  nombre: string;
  asistenciaAlumnos: number;
  asistenciaPersonal: number;
  ingresosMes: number;
  costosMes: number;
  alumnosActivos: number;
  personalActivo: number;
  satisfaccionApoderados: number;
  cumplimientoD170: number;
  rotacionPersonal: number;
}

// ─── Billing / Suscripciones ───

export type BillingStatus = "activo" | "por_vencer" | "vencido" | "suspendido";

export interface TenantBilling {
  tenantId: string;
  tenantName: string;
  plan: SubscriptionPlan;
  status: BillingStatus;
  monthlyAmount: number;
  nextPaymentDate: string;
  paymentMethod: string;
  lastPaymentDate: string | null;
  modulesIncluded: string[];
}

// ─── Audit Log Detallado ───

export interface DetailedAuditLog {
  id: string;
  tenantId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  resource: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  oldValue: string | null;
  newValue: string | null;
  clientIp: string;
  timestamp: string;
}

// ─── MINEDUC Export ───

export type MINEDUCReportType = "asistencia" | "matricula" | "decreto170" | "personal";

export const MINEDUC_REPORT_LABELS: Record<MINEDUCReportType, string> = {
  asistencia: "Registro de Asistencia (SIGE)",
  matricula: "Declaración de Matrícula",
  decreto170: "Informe PIE/D170",
  personal: "Dotación Docente",
};

export const NAV_PERMISSION_MAP: Record<string, PermissionKey> = {
  "/": "alumnos.ver",
  "/cursos": "cursos.ver",
  "/alumnos": "alumnos.ver",
  "/personal": "personal.ver",
  "/configuracion": "configuracion.ver",
};
