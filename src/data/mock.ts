import type {
  Alumno, Curso, KpiData, TenantConfig, User,
  AttendanceRecord, RetirementLog, AuthorizedRetiree, AttendanceAlert,
  DailyLogEntry, Decreto170Record, SpecialistSession, Decreto170Alert,
  FueiRecord, SchoolEvent,
  Communication, MenuSemanal, StaffAttendance, Receipt,
  SecurityLog, Notification, DeviceToken,
  NotificationTemplate, SmartNotification,
  ChatConversation, ChatMessage,
  TenantSaaS, AuditLog, SupportTicket,
  Liquidacion, LeaveRequest, SedeMetrics,
  TenantBilling, DetailedAuditLog,
} from "@/types";
import { EVENT_PRIORITY_MAP } from "@/types";
import { DEFAULT_PERMISSIONS } from "@/types";
import type { Medicamento, Autorizaciones } from "@/types";

const defaultAutorizaciones: Autorizaciones = {
  primerosAuxilios: true,
  trasladoUrgencia: true,
  usoImagen: true,
  contactoUrgenciaNombre: "",
  contactoUrgenciaTelefono: "",
};

export const tenantConfig: TenantConfig = {
  id: "tenant-001",
  nombre: "Jardín Infantil Rayito de Sol",
  rbd: "12345-6",
  direccion: "Av. Los Aromos 1234",
  comuna: "Maipú",
  region: "Metropolitana",
  telefono: "+56 2 2345 6789",
  email: "contacto@rayitodesol.cl",
  director: "María Fernanda Contreras López",
  modalidad: "jardin_infantil",
  logoUrl: undefined,
};

export const kpiData: KpiData[] = [
  { label: "Alumnos Presentes", valor: 42, total: 55, icono: "UserCheck", color: "success" },
  { label: "Alumnos Ausentes", valor: 8, total: 55, icono: "UserX", color: "danger" },
  { label: "Alertas Médicas", valor: 3, icono: "HeartPulse", color: "warning" },
  { label: "Accidentes Registrados", valor: 1, icono: "ShieldAlert", color: "primary" },
];

export const cursos: Curso[] = [
  {
    id: "cur-001",
    tenantId: "tenant-001",
    officialLevel: "sala_cuna_mayor",
    creativeName: "Los Conejitos",
    educadoraTitular: "Patricia Lagos Muñoz",
    capacidad: 20,
    anio: 2026,
    activo: true,
  },
  {
    id: "cur-002",
    tenantId: "tenant-001",
    officialLevel: "medio_menor",
    creativeName: "Los Exploradores",
    educadoraTitular: "Claudia Ríos Sepúlveda",
    capacidad: 25,
    anio: 2026,
    activo: true,
  },
  {
    id: "cur-003",
    tenantId: "tenant-001",
    officialLevel: "medio_mayor",
    creativeName: "Mundo de Voces",
    educadoraTitular: "Javiera Ortega Bravo",
    capacidad: 25,
    anio: 2026,
    activo: true,
  },
  {
    id: "cur-004",
    tenantId: "tenant-001",
    officialLevel: "transicion_menor",
    creativeName: null,
    educadoraTitular: "Marcela Fuentes Castro",
    capacidad: 30,
    anio: 2026,
    activo: true,
  },
  {
    id: "cur-005",
    tenantId: "tenant-001",
    officialLevel: "medio_menor",
    creativeName: "Las Estrellitas",
    educadoraTitular: "Rosa Tapia Morales",
    capacidad: 25,
    anio: 2026,
    activo: true,
  },
];

export function getCursoById(id: string): Curso | undefined {
  return cursos.find((c) => c.id === id);
}

export const alumnos: Alumno[] = [
  {
    id: "alu-001",
    tenantId: "tenant-001",
    rut: "23.456.789-0",
    nombres: "Sofía Antonia",
    apellidoPaterno: "Muñoz",
    apellidoMaterno: "Soto",
    fechaNacimiento: "2022-03-15",
    genero: "femenino",
    nacionalidad: "Chilena",
    nivel: "medio_menor",
    cursoId: "cur-002",
    estadoAsistencia: "presente",
    direccion: "Pasaje Los Álamos 456",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 1234 5678",
    email: "familia.munoz@email.com",
    grupoFamiliar: [
      { nombre: "Carolina Soto Pérez", parentesco: "Madre", edad: 29, viveConAlumno: true },
      { nombre: "Andrés Muñoz Rojas", parentesco: "Padre", edad: 31, viveConAlumno: true },
      { nombre: "Matías Muñoz Soto", parentesco: "Hermano", edad: 6, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Buena salud general. Activa y sociable.",
      grupoSanguineo: "O+",
      alergias: ["Maní"],
      alergiasDetalle: "Alergia alimentaria a maní confirmada. Reacción cutánea. Evitar contacto.",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: true,
      antecedentes: "Sin antecedentes quirúrgicos ni hospitalizaciones.",
      observacionesMedicas: "Sin observaciones relevantes",
      seguridadSocial: "Fonasa",
      hospitalReferencia: "Hospital El Carmen",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Rosa Pérez Martínez", contactoUrgenciaTelefono: "+56 9 5555 1234" },
    },
    apoderados: [
      {
        id: "apo-001",
        rut: "16.789.012-3",
        nombres: "Carolina",
        apellidoPaterno: "Soto",
        apellidoMaterno: "Pérez",
        parentesco: "madre",
        telefono: "+56 9 1234 5678",
        telefonoAlternativo: "+56 9 8765 4321",
        email: "carolina.soto@email.com",
        direccion: "Pasaje Los Álamos 456",
        comuna: "Maipú",
        ocupacion: "Profesora de Educación Básica",
        lugarTrabajo: "Colegio San José",
        esTitular: true,
      },
      {
        id: "apo-002",
        rut: "15.678.901-2",
        nombres: "Andrés",
        apellidoPaterno: "Muñoz",
        apellidoMaterno: "Rojas",
        parentesco: "padre",
        telefono: "+56 9 9876 5432",
        email: "andres.munoz@email.com",
        direccion: "Pasaje Los Álamos 456",
        comuna: "Maipú",
        ocupacion: "Ingeniero Civil",
        lugarTrabajo: "Constructora Araucaria",
        esTitular: false,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-001",
        nombreCompleto: "Rosa Pérez Martínez",
        parentesco: "Abuela materna",
        telefono: "+56 9 5555 1234",
        autorizadoRetirar: true,
      },
      {
        id: "eme-002",
        nombreCompleto: "Luis Muñoz Tapia",
        parentesco: "Abuelo paterno",
        telefono: "+56 9 5555 5678",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-001-2026",
    fechaMatricula: "2026-02-28",
    activo: true,
  },
  {
    id: "alu-002",
    tenantId: "tenant-001",
    rut: "23.567.890-1",
    nombres: "Benjamín Ignacio",
    apellidoPaterno: "González",
    apellidoMaterno: "Araya",
    fechaNacimiento: "2021-07-22",
    genero: "masculino",
    nacionalidad: "Chilena",
    nivel: "medio_mayor",
    cursoId: "cur-003",
    estadoAsistencia: "presente",
    direccion: "Calle Los Cerezos 789",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 2345 6789",
    grupoFamiliar: [
      { nombre: "Paola Araya Díaz", parentesco: "Madre", edad: 34, viveConAlumno: true },
      { nombre: "Felipe González López", parentesco: "Padre", edad: 36, viveConAlumno: false },
    ],
    salud: {
      condicionGeneral: "Asma leve controlada. Requiere inhalador SOS.",
      grupoSanguineo: "A+",
      alergias: [],
      alergiasDetalle: "",
      enfermedadesCronicas: ["Asma leve"],
      medicamentos: [{ nombre: "Salbutamol", dosis: "2 puff", frecuencia: "SOS en crisis", horaAdministracion: "Según necesidad", recetaAdjunta: true }],
      vacunasAlDia: true,
      antecedentes: "Bronquitis obstructiva a los 8 meses. Control neumológico semestral.",
      observacionesMedicas: "Usar inhalador en caso de crisis. Evitar ejercicio intenso en días fríos.",
      seguridadSocial: "Isapre Colmena",
      hospitalReferencia: "Clínica Dávila",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "María Díaz Rojas", contactoUrgenciaTelefono: "+56 9 6666 1234" },
    },
    apoderados: [
      {
        id: "apo-003",
        rut: "17.890.123-4",
        nombres: "Paola",
        apellidoPaterno: "Araya",
        apellidoMaterno: "Díaz",
        parentesco: "madre",
        telefono: "+56 9 2345 6789",
        email: "paola.araya@email.com",
        direccion: "Calle Los Cerezos 789",
        comuna: "Maipú",
        ocupacion: "Contadora Auditora",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-003",
        nombreCompleto: "María Díaz Rojas",
        parentesco: "Abuela materna",
        telefono: "+56 9 6666 1234",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-002-2026",
    fechaMatricula: "2026-02-25",
    activo: true,
  },
  {
    id: "alu-003",
    tenantId: "tenant-001",
    rut: "23.678.901-2",
    nombres: "Isabella",
    apellidoPaterno: "Rodríguez",
    apellidoMaterno: "Valenzuela",
    fechaNacimiento: "2022-11-03",
    genero: "femenino",
    nacionalidad: "Chilena",
    nivel: "medio_menor",
    cursoId: "cur-005",
    estadoAsistencia: "ausente",
    direccion: "Av. Pajaritos 2345",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 3456 7890",
    grupoFamiliar: [
      { nombre: "Claudia Valenzuela Pino", parentesco: "Madre", edad: 27, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Intolerancia alimentaria. Requiere dieta especial.",
      grupoSanguineo: "B+",
      alergias: ["Huevo", "Leche de vaca"],
      alergiasDetalle: "Intolerancia a la lactosa + alergia a proteína de huevo. Dieta supervisada por nutricionista.",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: true,
      antecedentes: "Sin antecedentes relevantes.",
      observacionesMedicas: "Intolerancia a la lactosa. Requiere dieta especial.",
      seguridadSocial: "Fonasa",
      hospitalReferencia: "Hospital El Carmen",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Jorge Valenzuela Pino", contactoUrgenciaTelefono: "+56 9 7777 1234" },
    },
    apoderados: [
      {
        id: "apo-004",
        rut: "18.901.234-5",
        nombres: "Claudia",
        apellidoPaterno: "Valenzuela",
        apellidoMaterno: "Pino",
        parentesco: "madre",
        telefono: "+56 9 3456 7890",
        email: "claudia.valenzuela@email.com",
        direccion: "Av. Pajaritos 2345",
        comuna: "Maipú",
        ocupacion: "Técnica en Enfermería",
        lugarTrabajo: "CESFAM Maipú",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-004",
        nombreCompleto: "Jorge Valenzuela Pino",
        parentesco: "Tío materno",
        telefono: "+56 9 7777 1234",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-003-2026",
    fechaMatricula: "2026-03-01",
    activo: true,
  },
  {
    id: "alu-004",
    tenantId: "tenant-001",
    rut: "23.789.012-3",
    nombres: "Martín Alonso",
    apellidoPaterno: "Silva",
    apellidoMaterno: "Fuentes",
    fechaNacimiento: "2021-01-10",
    genero: "masculino",
    nacionalidad: "Chilena",
    nivel: "medio_mayor",
    cursoId: "cur-003",
    estadoAsistencia: "presente",
    direccion: "Calle Las Acacias 567",
    comuna: "Cerrillos",
    region: "Metropolitana",
    telefono: "+56 9 4567 8901",
    grupoFamiliar: [
      { nombre: "Andrea Fuentes Castro", parentesco: "Madre", edad: 32, viveConAlumno: true },
      { nombre: "Rodrigo Silva Morales", parentesco: "Padre", edad: 33, viveConAlumno: true },
      { nombre: "Emilia Silva Fuentes", parentesco: "Hermana", edad: 1, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Buen estado de salud general.",
      grupoSanguineo: "O+",
      alergias: [],
      alergiasDetalle: "",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: true,
      antecedentes: "Sin antecedentes relevantes.",
      observacionesMedicas: "Sin observaciones",
      seguridadSocial: "Isapre Cruz Blanca",
      hospitalReferencia: "Hospital Barros Luco",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Patricia Castro López", contactoUrgenciaTelefono: "+56 9 8888 1234" },
    },
    apoderados: [
      {
        id: "apo-005",
        rut: "17.012.345-6",
        nombres: "Andrea",
        apellidoPaterno: "Fuentes",
        apellidoMaterno: "Castro",
        parentesco: "madre",
        telefono: "+56 9 4567 8901",
        email: "andrea.fuentes@email.com",
        direccion: "Calle Las Acacias 567",
        comuna: "Cerrillos",
        ocupacion: "Diseñadora Gráfica",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-005",
        nombreCompleto: "Patricia Castro López",
        parentesco: "Abuela materna",
        telefono: "+56 9 8888 1234",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-004-2026",
    fechaMatricula: "2026-02-20",
    activo: true,
  },
  {
    id: "alu-005",
    tenantId: "tenant-001",
    rut: "23.890.123-4",
    nombres: "Agustina Paz",
    apellidoPaterno: "Hernández",
    apellidoMaterno: "Reyes",
    fechaNacimiento: "2023-05-20",
    genero: "femenino",
    nacionalidad: "Chilena",
    nivel: "sala_cuna_mayor",
    cursoId: "cur-001",
    estadoAsistencia: "presente",
    direccion: "Pasaje Los Olivos 123",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 5678 9012",
    grupoFamiliar: [
      { nombre: "Constanza Reyes Muñoz", parentesco: "Madre", edad: 25, viveConAlumno: true },
      { nombre: "Diego Hernández Tapia", parentesco: "Padre", edad: 28, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Alergia medicamentosa confirmada. Vacunas pendientes.",
      grupoSanguineo: "AB+",
      alergias: ["Penicilina"],
      alergiasDetalle: "Alergia a Penicilina confirmada por alergólogo. Contraindicados todos los betalactámicos.",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: false,
      antecedentes: "Reacción alérgica a amoxicilina a los 6 meses (urticaria generalizada).",
      observacionesMedicas: "Pendiente vacuna hexavalente 3ra dosis. Alergia a Penicilina confirmada.",
      seguridadSocial: "Fonasa",
      hospitalReferencia: "Hospital El Carmen",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "María Muñoz Lagos", contactoUrgenciaTelefono: "+56 9 9999 1234" },
    },
    apoderados: [
      {
        id: "apo-006",
        rut: "19.123.456-7",
        nombres: "Constanza",
        apellidoPaterno: "Reyes",
        apellidoMaterno: "Muñoz",
        parentesco: "madre",
        telefono: "+56 9 5678 9012",
        email: "constanza.reyes@email.com",
        direccion: "Pasaje Los Olivos 123",
        comuna: "Maipú",
        ocupacion: "Estudiante universitaria",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-006",
        nombreCompleto: "María Muñoz Lagos",
        parentesco: "Abuela materna",
        telefono: "+56 9 9999 1234",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-005-2026",
    fechaMatricula: "2026-03-05",
    activo: true,
  },
  {
    id: "alu-006",
    tenantId: "tenant-001",
    rut: "23.901.234-5",
    nombres: "Lucas Emilio",
    apellidoPaterno: "Torres",
    apellidoMaterno: "Espinoza",
    fechaNacimiento: "2021-09-08",
    genero: "masculino",
    nacionalidad: "Chilena",
    nivel: "medio_mayor",
    cursoId: "cur-003",
    estadoAsistencia: "justificado",
    direccion: "Av. Los Libertadores 890",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 6789 0123",
    grupoFamiliar: [
      { nombre: "Valentina Espinoza Riquelme", parentesco: "Madre", edad: 30, viveConAlumno: true },
      { nombre: "Sebastián Torres Guzmán", parentesco: "Padre", edad: 32, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Dermatitis atópica en tratamiento. Requiere cuidados de piel.",
      grupoSanguineo: "A-",
      alergias: [],
      alergiasDetalle: "",
      enfermedadesCronicas: ["Dermatitis atópica"],
      medicamentos: [{ nombre: "Crema hidratante medicada (Lipikar)", dosis: "Aplicación tópica", frecuencia: "Después de cada lavado de manos", horaAdministracion: "Según necesidad", recetaAdjunta: true }],
      vacunasAlDia: true,
      antecedentes: "Dermatitis atópica diagnosticada a los 10 meses. Control dermatológico trimestral.",
      observacionesMedicas: "Aplicar crema después del lavado de manos. Evitar jabones perfumados.",
      seguridadSocial: "Fonasa",
      hospitalReferencia: "Hospital El Carmen",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Carmen Riquelme Soto", contactoUrgenciaTelefono: "+56 9 1111 5678" },
    },
    apoderados: [
      {
        id: "apo-007",
        rut: "18.234.567-8",
        nombres: "Valentina",
        apellidoPaterno: "Espinoza",
        apellidoMaterno: "Riquelme",
        parentesco: "madre",
        telefono: "+56 9 6789 0123",
        email: "valentina.espinoza@email.com",
        direccion: "Av. Los Libertadores 890",
        comuna: "Maipú",
        ocupacion: "Administradora de Empresas",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-007",
        nombreCompleto: "Carmen Riquelme Soto",
        parentesco: "Abuela materna",
        telefono: "+56 9 1111 5678",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-006-2026",
    fechaMatricula: "2026-02-22",
    activo: true,
  },
  {
    id: "alu-007",
    tenantId: "tenant-001",
    rut: "24.012.345-6",
    nombres: "Emilia Catalina",
    apellidoPaterno: "Vargas",
    apellidoMaterno: "Cáceres",
    fechaNacimiento: "2022-06-14",
    genero: "femenino",
    nacionalidad: "Chilena",
    nivel: "medio_menor",
    cursoId: "cur-002",
    estadoAsistencia: "presente",
    direccion: "Calle Los Jazmines 345",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 7890 1234",
    grupoFamiliar: [
      { nombre: "Fernanda Cáceres Ríos", parentesco: "Madre", edad: 28, viveConAlumno: true },
      { nombre: "Tomás Vargas Muñoz", parentesco: "Padre", edad: 30, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Excelente estado de salud.",
      grupoSanguineo: "O-",
      alergias: [],
      alergiasDetalle: "",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: true,
      antecedentes: "Sin antecedentes relevantes.",
      observacionesMedicas: "Sin observaciones",
      seguridadSocial: "Isapre Banmédica",
      hospitalReferencia: "Clínica Santa María",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Gloria Ríos Martínez", contactoUrgenciaTelefono: "+56 9 2222 5678" },
    },
    apoderados: [
      {
        id: "apo-008",
        rut: "18.345.678-9",
        nombres: "Fernanda",
        apellidoPaterno: "Cáceres",
        apellidoMaterno: "Ríos",
        parentesco: "madre",
        telefono: "+56 9 7890 1234",
        email: "fernanda.caceres@email.com",
        direccion: "Calle Los Jazmines 345",
        comuna: "Maipú",
        ocupacion: "Psicóloga Clínica",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-008",
        nombreCompleto: "Gloria Ríos Martínez",
        parentesco: "Abuela materna",
        telefono: "+56 9 2222 5678",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-007-2026",
    fechaMatricula: "2026-03-02",
    activo: true,
  },
  {
    id: "alu-008",
    tenantId: "tenant-001",
    rut: "24.123.456-7",
    nombres: "Mateo Nicolás",
    apellidoPaterno: "Rojas",
    apellidoMaterno: "Pizarro",
    fechaNacimiento: "2020-12-01",
    genero: "masculino",
    nacionalidad: "Chilena",
    nivel: "transicion_menor",
    cursoId: "cur-004",
    estadoAsistencia: "presente",
    direccion: "Av. Las Rejas Sur 1567",
    comuna: "Estación Central",
    region: "Metropolitana",
    telefono: "+56 9 8901 2345",
    grupoFamiliar: [
      { nombre: "Camila Pizarro Orellana", parentesco: "Madre", edad: 35, viveConAlumno: true },
      { nombre: "José Rojas Contreras", parentesco: "Padre", edad: 37, viveConAlumno: true },
      { nombre: "Valentina Rojas Pizarro", parentesco: "Hermana", edad: 8, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Rinitis alérgica estacional en tratamiento.",
      grupoSanguineo: "B-",
      alergias: ["Ácaros"],
      alergiasDetalle: "Alergia a ácaros del polvo. Rinitis estacional en otoño-invierno.",
      enfermedadesCronicas: [],
      medicamentos: [{ nombre: "Loratadina", dosis: "5 mg", frecuencia: "1 vez al día", horaAdministracion: "08:00 (mañana)", recetaAdjunta: true }],
      vacunasAlDia: true,
      antecedentes: "Rinitis alérgica diagnosticada a los 3 años. Control alergológico semestral.",
      observacionesMedicas: "Rinitis alérgica estacional. Control con alergólogo cada 6 meses.",
      seguridadSocial: "Fonasa",
      hospitalReferencia: "Hospital San Borja Arriarán",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Manuel Rojas Lagos", contactoUrgenciaTelefono: "+56 9 3333 5678" },
    },
    apoderados: [
      {
        id: "apo-009",
        rut: "16.456.789-0",
        nombres: "Camila",
        apellidoPaterno: "Pizarro",
        apellidoMaterno: "Orellana",
        parentesco: "madre",
        telefono: "+56 9 8901 2345",
        email: "camila.pizarro@email.com",
        direccion: "Av. Las Rejas Sur 1567",
        comuna: "Estación Central",
        ocupacion: "Fonoaudióloga",
        lugarTrabajo: "Centro de Salud Familiar",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-009",
        nombreCompleto: "Manuel Rojas Lagos",
        parentesco: "Abuelo paterno",
        telefono: "+56 9 3333 5678",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-008-2026",
    fechaMatricula: "2026-02-18",
    activo: true,
  },
  {
    id: "alu-009",
    tenantId: "tenant-001",
    rut: "24.234.567-8",
    nombres: "Antonella Isidora",
    apellidoPaterno: "Morales",
    apellidoMaterno: "Jara",
    fechaNacimiento: "2023-02-28",
    genero: "femenino",
    nacionalidad: "Chilena",
    nivel: "sala_cuna_mayor",
    cursoId: "cur-001",
    estadoAsistencia: "ausente",
    direccion: "Pasaje Las Violetas 67",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 9012 3456",
    grupoFamiliar: [
      { nombre: "Daniela Jara Aravena", parentesco: "Madre", edad: 24, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Buena salud general.",
      grupoSanguineo: "desconocido",
      alergias: [],
      alergiasDetalle: "",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: true,
      antecedentes: "Sin antecedentes relevantes.",
      observacionesMedicas: "Sin observaciones",
      seguridadSocial: "Fonasa",
      hospitalReferencia: "Hospital El Carmen",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Sandra Aravena Muñoz", contactoUrgenciaTelefono: "+56 9 4444 5678" },
    },
    apoderados: [
      {
        id: "apo-010",
        rut: "19.567.890-1",
        nombres: "Daniela",
        apellidoPaterno: "Jara",
        apellidoMaterno: "Aravena",
        parentesco: "madre",
        telefono: "+56 9 9012 3456",
        email: "daniela.jara@email.com",
        direccion: "Pasaje Las Violetas 67",
        comuna: "Maipú",
        ocupacion: "Vendedora",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-010",
        nombreCompleto: "Sandra Aravena Muñoz",
        parentesco: "Abuela materna",
        telefono: "+56 9 4444 5678",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-009-2026",
    fechaMatricula: "2026-03-10",
    activo: true,
  },
  {
    id: "alu-010",
    tenantId: "tenant-001",
    rut: "24.345.678-9",
    nombres: "Tomás Alejandro",
    apellidoPaterno: "Castillo",
    apellidoMaterno: "Vera",
    fechaNacimiento: "2021-04-17",
    genero: "masculino",
    nacionalidad: "Chilena",
    nivel: "medio_mayor",
    cursoId: "cur-003",
    estadoAsistencia: "presente",
    direccion: "Calle Los Aromos 890",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 0123 4567",
    grupoFamiliar: [
      { nombre: "Javiera Vera Paredes", parentesco: "Madre", edad: 31, viveConAlumno: true },
      { nombre: "Cristián Castillo Lagos", parentesco: "Padre", edad: 34, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Buen estado de salud.",
      grupoSanguineo: "A+",
      alergias: [],
      alergiasDetalle: "",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: true,
      antecedentes: "Sin antecedentes relevantes.",
      observacionesMedicas: "Sin observaciones",
      seguridadSocial: "Isapre Vida Tres",
      hospitalReferencia: "Clínica Indisa",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Elena Paredes Soto", contactoUrgenciaTelefono: "+56 9 5555 9999" },
    },
    apoderados: [
      {
        id: "apo-011",
        rut: "17.678.901-2",
        nombres: "Javiera",
        apellidoPaterno: "Vera",
        apellidoMaterno: "Paredes",
        parentesco: "madre",
        telefono: "+56 9 0123 4567",
        email: "javiera.vera@email.com",
        direccion: "Calle Los Aromos 890",
        comuna: "Maipú",
        ocupacion: "Ingeniera Comercial",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-011",
        nombreCompleto: "Elena Paredes Soto",
        parentesco: "Abuela materna",
        telefono: "+56 9 5555 9999",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-010-2026",
    fechaMatricula: "2026-02-15",
    activo: true,
  },
  {
    id: "alu-011",
    tenantId: "tenant-001",
    rut: "24.456.789-0",
    nombres: "Joaquín Andrés",
    apellidoPaterno: "Sepúlveda",
    apellidoMaterno: "Contreras",
    fechaNacimiento: "2020-08-25",
    genero: "masculino",
    nacionalidad: "Chilena",
    nivel: "transicion_menor",
    cursoId: "cur-004",
    estadoAsistencia: "presente",
    direccion: "Av. Américo Vespucio 4567",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 1122 3344",
    grupoFamiliar: [
      { nombre: "Francisca Contreras Mora", parentesco: "Madre", edad: 33, viveConAlumno: true },
      { nombre: "Pablo Sepúlveda Rivas", parentesco: "Padre", edad: 35, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Alergia alimentaria a colorantes. TEL Mixto en tratamiento.",
      grupoSanguineo: "O+",
      alergias: ["Colorantes artificiales"],
      alergiasDetalle: "Reacción cutánea a colorantes artificiales en alimentos (tartrazina, rojo 40).",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: true,
      antecedentes: "Episodio de urticaria por colorantes a los 2 años. Diagnóstico TEL Mixto 2025.",
      observacionesMedicas: "Reacción cutánea a colorantes artificiales en alimentos.",
      seguridadSocial: "Fonasa",
      hospitalReferencia: "Hospital El Carmen",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Teresa Mora Gutiérrez", contactoUrgenciaTelefono: "+56 9 6677 8899" },
    },
    diagnosticoClinico: {
      diagnosticoPrincipal: "Trastorno Específico del Lenguaje (TEL) Mixto",
      cie10: "F80.2",
      fechaDiagnostico: "2025-03-15",
      profesionalDiagnostico: "Dra. Carmen Vega Soto",
      institucionDiagnostico: "CESFAM Maipú Centro",
      observaciones: "Derivado a tratamiento fonoaudiológico y apoyo psicológico para habilidades sociales.",
    },
    fonoaudiologia: {
      diagnostico: "Trastorno Específico del Lenguaje (TEL) Mixto",
      decreto170: true,
      nee: "Transitoria",
      fechaIngreso: "2025-04-10",
      profesionalTratante: "Fga. María José Ruiz",
      frecuenciaSesiones: "2 veces por semana",
      observaciones: "Avance significativo en comprensión. Continuar trabajo en expresión verbal.",
    },
    psicologia: {
      diagnostico: "Dificultades en habilidades sociales asociadas a TEL",
      fechaIngreso: "2025-05-01",
      profesionalTratante: "Ps. Andrea Molina Castro",
      frecuenciaSesiones: "1 vez por semana",
      areasIntervenir: ["Habilidades sociales", "Autoestima", "Regulación emocional"],
      observaciones: "Buen vínculo terapéutico. Se trabaja con juego dirigido y modelamiento.",
    },
    apoderados: [
      {
        id: "apo-012",
        rut: "17.789.012-3",
        nombres: "Francisca",
        apellidoPaterno: "Contreras",
        apellidoMaterno: "Mora",
        parentesco: "madre",
        telefono: "+56 9 1122 3344",
        email: "francisca.contreras@email.com",
        direccion: "Av. Américo Vespucio 4567",
        comuna: "Maipú",
        ocupacion: "Educadora de Párvulos",
        lugarTrabajo: "Jardín Nacional",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-012",
        nombreCompleto: "Teresa Mora Gutiérrez",
        parentesco: "Abuela materna",
        telefono: "+56 9 6677 8899",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-011-2026",
    fechaMatricula: "2026-02-10",
    activo: true,
  },
  {
    id: "alu-012",
    tenantId: "tenant-001",
    rut: "24.567.890-1",
    nombres: "Florencia Maite",
    apellidoPaterno: "Leiva",
    apellidoMaterno: "Bravo",
    fechaNacimiento: "2022-09-30",
    genero: "femenino",
    nacionalidad: "Chilena",
    nivel: "medio_menor",
    cursoId: "cur-005",
    estadoAsistencia: "presente",
    direccion: "Calle Las Dalias 234",
    comuna: "Maipú",
    region: "Metropolitana",
    telefono: "+56 9 2233 4455",
    grupoFamiliar: [
      { nombre: "Nicole Bravo Salazar", parentesco: "Madre", edad: 26, viveConAlumno: true },
      { nombre: "Esteban Leiva Figueroa", parentesco: "Padre", edad: 29, viveConAlumno: true },
    ],
    salud: {
      condicionGeneral: "Buena salud general.",
      grupoSanguineo: "B+",
      alergias: [],
      alergiasDetalle: "",
      enfermedadesCronicas: [],
      medicamentos: [],
      vacunasAlDia: true,
      antecedentes: "Sin antecedentes relevantes.",
      observacionesMedicas: "Sin observaciones",
      seguridadSocial: "Fonasa",
      hospitalReferencia: "Hospital El Carmen",
      autorizaciones: { ...defaultAutorizaciones, contactoUrgenciaNombre: "Patricia Salazar López", contactoUrgenciaTelefono: "+56 9 7788 9900" },
    },
    apoderados: [
      {
        id: "apo-013",
        rut: "19.890.123-4",
        nombres: "Nicole",
        apellidoPaterno: "Bravo",
        apellidoMaterno: "Salazar",
        parentesco: "madre",
        telefono: "+56 9 2233 4455",
        email: "nicole.bravo@email.com",
        direccion: "Calle Las Dalias 234",
        comuna: "Maipú",
        ocupacion: "Técnica en Párvulos",
        esTitular: true,
      },
    ],
    contactosEmergencia: [
      {
        id: "eme-013",
        nombreCompleto: "Patricia Salazar López",
        parentesco: "Abuela materna",
        telefono: "+56 9 7788 9900",
        autorizadoRetirar: true,
      },
    ],
    codigoQR: "QR-ALU-012-2026",
    fechaMatricula: "2026-03-03",
    activo: true,
  },
];

export function getAlumnoById(id: string): Alumno | undefined {
  return alumnos.find((a) => a.id === id);
}

export function getAlumnosByNivel(nivel: string): Alumno[] {
  return alumnos.filter((a) => a.nivel === nivel);
}

export function searchAlumnos(query: string): Alumno[] {
  const q = query.toLowerCase();
  return alumnos.filter(
    (a) =>
      a.nombres.toLowerCase().includes(q) ||
      a.apellidoPaterno.toLowerCase().includes(q) ||
      a.apellidoMaterno.toLowerCase().includes(q) ||
      a.rut.includes(q)
  );
}

// ─── Usuarios / Personal ───

export const usuarios: User[] = [
  {
    id: "usr-001",
    tenantId: "tenant-001",
    email: "maria.contreras@rayitodesol.cl",
    passwordHash: "$2b$10$mock.director.hash",
    nombreCompleto: "María Fernanda Contreras López",
    rut: "12.345.678-9",
    role: "director",
    permissions: [...DEFAULT_PERMISSIONS.director],
    cursoAsignado: null,
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: "usr-002",
    tenantId: "tenant-001",
    email: "patricia.lagos@rayitodesol.cl",
    passwordHash: "$2b$10$mock.educadora1.hash",
    nombreCompleto: "Patricia Lagos Muñoz",
    rut: "14.567.890-1",
    role: "educadora",
    permissions: [...DEFAULT_PERMISSIONS.educadora],
    cursoAsignado: "cur-001",
    isActive: true,
    createdAt: "2026-01-20",
  },
  {
    id: "usr-003",
    tenantId: "tenant-001",
    email: "claudia.rios@rayitodesol.cl",
    passwordHash: "$2b$10$mock.educadora2.hash",
    nombreCompleto: "Claudia Ríos Sepúlveda",
    rut: "15.678.901-2",
    role: "educadora",
    permissions: [...DEFAULT_PERMISSIONS.educadora],
    cursoAsignado: "cur-002",
    isActive: true,
    createdAt: "2026-01-20",
  },
  {
    id: "usr-004",
    tenantId: "tenant-001",
    email: "mjose.ruiz@rayitodesol.cl",
    passwordHash: "$2b$10$mock.fono.hash",
    nombreCompleto: "María José Ruiz Tapia",
    rut: "16.789.012-3",
    role: "fonoaudiologo",
    permissions: [...DEFAULT_PERMISSIONS.fonoaudiologo],
    cursoAsignado: null,
    isActive: true,
    createdAt: "2026-02-01",
  },
  {
    id: "usr-005",
    tenantId: "tenant-001",
    email: "andrea.molina@rayitodesol.cl",
    passwordHash: "$2b$10$mock.psicologo.hash",
    nombreCompleto: "Andrea Molina Castro",
    rut: "17.890.123-4",
    role: "psicologo",
    permissions: [...DEFAULT_PERMISSIONS.psicologo],
    cursoAsignado: null,
    isActive: true,
    createdAt: "2026-02-01",
  },
  {
    id: "usr-006",
    tenantId: "tenant-001",
    email: "rosa.tapia@rayitodesol.cl",
    passwordHash: "$2b$10$mock.asistente.hash",
    nombreCompleto: "Rosa Tapia Morales",
    rut: "13.456.789-0",
    role: "asistente",
    permissions: [...DEFAULT_PERMISSIONS.asistente],
    cursoAsignado: "cur-005",
    isActive: true,
    createdAt: "2026-01-25",
  },
  {
    id: "usr-007",
    tenantId: "tenant-001",
    email: "carmen.vega@rayitodesol.cl",
    passwordHash: "$2b$10$mock.medico.hash",
    nombreCompleto: "Carmen Vega Soto",
    rut: "11.234.567-8",
    role: "medico",
    permissions: [...DEFAULT_PERMISSIONS.medico],
    cursoAsignado: null,
    isActive: false,
    createdAt: "2026-02-10",
  },
  {
    id: "usr-008",
    tenantId: "tenant-001",
    email: "lorena.silva@rayitodesol.cl",
    passwordHash: "$2b$10$mock.admin.hash",
    nombreCompleto: "Lorena Silva Paredes",
    rut: "18.901.234-5",
    role: "administrativo",
    permissions: [...DEFAULT_PERMISSIONS.administrativo],
    cursoAsignado: null,
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: "usr-009",
    tenantId: "tenant-001",
    email: "tablet.porteria@rayitodesol.cl",
    passwordHash: "$2b$10$mock.gate.hash",
    nombreCompleto: "Tablet Portería",
    rut: "00.000.000-0",
    role: "security_gate" as const,
    permissions: [...DEFAULT_PERMISSIONS.security_gate],
    cursoAsignado: null,
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: "usr-sostenedor",
    tenantId: "global",
    email: "sostenedor@usami.cl",
    passwordHash: "$2b$10$mock.sostenedor.hash",
    nombreCompleto: "Roberto Méndez Soto",
    rut: "8.765.432-1",
    role: "sostenedor" as const,
    permissions: [...DEFAULT_PERMISSIONS.sostenedor],
    cursoAsignado: null,
    isActive: true,
    createdAt: "2025-01-01",
  },
  {
    id: "usr-superadmin",
    tenantId: "global",
    email: "admin@usami.cl",
    passwordHash: "$2b$10$mock.superadmin.hash",
    nombreCompleto: "Admin USAMI SaaS",
    rut: "99.999.999-9",
    role: "superadmin" as const,
    permissions: [...DEFAULT_PERMISSIONS.superadmin],
    cursoAsignado: null,
    isActive: true,
    createdAt: "2025-01-01",
  },
];

// ─── Asistencia ───

export const attendanceRecords: AttendanceRecord[] = [
  { id: "att-0611-001", tenantId: "tenant-001", studentId: "alu-001", cursoId: "cur-002", date: "2026-06-11", status: "present", checkInTime: "08:15", registeredBy: "usr-002", registeredAt: "2026-06-11T08:30:00" },
  { id: "att-0611-002", tenantId: "tenant-001", studentId: "alu-002", cursoId: "cur-003", date: "2026-06-11", status: "present", checkInTime: "08:10", registeredBy: "usr-002", registeredAt: "2026-06-11T08:30:00" },
  { id: "att-0611-003", tenantId: "tenant-001", studentId: "alu-003", cursoId: "cur-005", date: "2026-06-11", status: "absent", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-11T08:30:00" },
  { id: "att-0611-004", tenantId: "tenant-001", studentId: "alu-004", cursoId: "cur-003", date: "2026-06-11", status: "present", checkInTime: "08:20", registeredBy: "usr-002", registeredAt: "2026-06-11T08:30:00" },
  { id: "att-0611-005", tenantId: "tenant-001", studentId: "alu-005", cursoId: "cur-001", date: "2026-06-11", status: "late", checkInTime: "08:45", registeredBy: "usr-002", registeredAt: "2026-06-11T08:50:00" },
  { id: "att-0611-009", tenantId: "tenant-001", studentId: "alu-009", cursoId: "cur-001", date: "2026-06-11", status: "absent", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-11T08:30:00" },
  { id: "att-0612-001", tenantId: "tenant-001", studentId: "alu-001", cursoId: "cur-002", date: "2026-06-12", status: "present", checkInTime: "08:12", registeredBy: "usr-002", registeredAt: "2026-06-12T08:30:00" },
  { id: "att-0612-003", tenantId: "tenant-001", studentId: "alu-003", cursoId: "cur-005", date: "2026-06-12", status: "absent", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-12T08:30:00" },
  { id: "att-0612-009", tenantId: "tenant-001", studentId: "alu-009", cursoId: "cur-001", date: "2026-06-12", status: "absent", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-12T08:30:00" },
  { id: "att-0613-001", tenantId: "tenant-001", studentId: "alu-001", cursoId: "cur-002", date: "2026-06-13", status: "excused", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-13T08:30:00" },
  { id: "att-0613-003", tenantId: "tenant-001", studentId: "alu-003", cursoId: "cur-005", date: "2026-06-13", status: "absent", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-13T08:30:00" },
  { id: "att-0613-009", tenantId: "tenant-001", studentId: "alu-009", cursoId: "cur-001", date: "2026-06-13", status: "absent", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-13T08:30:00" },
  { id: "att-0616-002", tenantId: "tenant-001", studentId: "alu-002", cursoId: "cur-003", date: "2026-06-16", status: "present", checkInTime: "08:08", registeredBy: "usr-002", registeredAt: "2026-06-16T08:30:00" },
  { id: "att-0616-003", tenantId: "tenant-001", studentId: "alu-003", cursoId: "cur-005", date: "2026-06-16", status: "absent", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-16T08:30:00" },
  { id: "att-0616-004", tenantId: "tenant-001", studentId: "alu-004", cursoId: "cur-003", date: "2026-06-16", status: "present", checkInTime: "08:15", registeredBy: "usr-002", registeredAt: "2026-06-16T08:30:00" },
  { id: "att-0616-009", tenantId: "tenant-001", studentId: "alu-009", cursoId: "cur-001", date: "2026-06-16", status: "absent", checkInTime: null, registeredBy: "usr-002", registeredAt: "2026-06-16T08:30:00" },
];

export const authorizedRetirees: AuthorizedRetiree[] = [
  {
    id: "ret-001", studentId: "alu-001",
    nombreCompleto: "Carolina Soto Pérez", rut: "16.789.012-3",
    parentesco: "Madre", telefono: "+56 9 1234 5678",
    qrHash: "qr_hash_carolina_001", activo: true,
  },
  {
    id: "ret-002", studentId: "alu-001",
    nombreCompleto: "Rosa Pérez Martínez", rut: "10.123.456-7",
    parentesco: "Abuela materna", telefono: "+56 9 5555 1234",
    qrHash: "qr_hash_rosa_001", activo: true,
  },
  {
    id: "ret-003", studentId: "alu-002",
    nombreCompleto: "Paola Araya Díaz", rut: "17.890.123-4",
    parentesco: "Madre", telefono: "+56 9 2345 6789",
    qrHash: "qr_hash_paola_002", activo: true,
  },
  {
    id: "ret-004", studentId: "alu-004",
    nombreCompleto: "Andrea Fuentes Castro", rut: "17.012.345-6",
    parentesco: "Madre", telefono: "+56 9 4567 8901",
    qrHash: "qr_hash_andrea_004", activo: true,
  },
  {
    id: "ret-005", studentId: "alu-005",
    nombreCompleto: "Constanza Reyes Muñoz", rut: "19.123.456-7",
    parentesco: "Madre", telefono: "+56 9 5678 9012",
    qrHash: "qr_hash_constanza_005", activo: true,
  },
  {
    id: "ret-006", studentId: "alu-008",
    nombreCompleto: "Camila Pizarro Orellana", rut: "16.456.789-0",
    parentesco: "Madre", telefono: "+56 9 8901 2345",
    qrHash: "qr_hash_camila_008", activo: true,
  },
  {
    id: "ret-007", studentId: "alu-010",
    nombreCompleto: "Javiera Vera Paredes", rut: "17.678.901-2",
    parentesco: "Madre", telefono: "+56 9 0123 4567",
    qrHash: "qr_hash_javiera_010", activo: true,
  },
];

export const retirementLogs: RetirementLog[] = [
  {
    id: "rlog-001", tenantId: "tenant-001",
    studentId: "alu-001", authorizedByUserId: "usr-002",
    retireeName: "Carolina Soto Pérez", retireeRut: "16.789.012-3",
    retireeParentesco: "Madre",
    timestamp: "2026-06-15T16:30:00.000Z",
    qrCodeHashVerification: "qr_hash_carolina_001", verified: true,
  },
  {
    id: "rlog-002", tenantId: "tenant-001",
    studentId: "alu-004", authorizedByUserId: "usr-003",
    retireeName: "Andrea Fuentes Castro", retireeRut: "17.012.345-6",
    retireeParentesco: "Madre",
    timestamp: "2026-06-15T16:30:00.000Z",
    qrCodeHashVerification: "qr_hash_andrea_004", verified: true,
  },
];

export function getAttendanceAlerts(): AttendanceAlert[] {
  const alerts: AttendanceAlert[] = [];
  for (const alumno of alumnos) {
    const records = attendanceRecords
      .filter((r) => r.studentId === alumno.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    let consecutive = 0;
    for (const r of records) {
      if (r.status === "absent") consecutive++;
      else break;
    }
    if (consecutive >= 3) {
      alerts.push({
        studentId: alumno.id,
        studentName: `${alumno.nombres} ${alumno.apellidoPaterno}`,
        cursoId: alumno.cursoId || "",
        consecutiveAbsences: consecutive,
        lastAbsenceDate: records[0]?.date || "2026-06-16",
        type: consecutive >= 5 ? "critical" : "warning",
      });
    }
  }
  return alerts;
}

export function getAuthorizedRetireesForStudent(studentId: string): AuthorizedRetiree[] {
  return authorizedRetirees.filter((r) => r.studentId === studentId && r.activo);
}

export function validateQrHash(qrHash: string): AuthorizedRetiree | null {
  return authorizedRetirees.find((r) => r.qrHash === qrHash && r.activo) || null;
}

export function getTodayAttendanceForCurso(cursoId: string): AttendanceRecord[] {
  const today = new Date().toISOString().split("T")[0];
  return attendanceRecords.filter((r) => r.cursoId === cursoId && r.date === today);
}

// ─── Diario de Aula ───

const MOCK_TODAY = "2026-06-16";
const MOCK_YESTERDAY = "2026-06-15";

export const dailyLogEntries: DailyLogEntry[] = [
  {
    id: "dl-001", tenantId: "tenant-001", studentId: "alu-001", cursoId: "cur-002",
    date: MOCK_TODAY, category: "comida", timestamp: `${MOCK_TODAY}T09:00:00`,
    registeredBy: "usr-003", registeredByRole: "educadora",
    approvalStatus: "approved", approvedBy: "usr-003", approvedAt: `${MOCK_TODAY}T09:05:00`,
    comida: { tipo: "desayuno", cantidad: "todo" },
  },
  {
    id: "dl-002", tenantId: "tenant-001", studentId: "alu-001", cursoId: "cur-002",
    date: MOCK_TODAY, category: "higiene", timestamp: `${MOCK_TODAY}T09:30:00`,
    registeredBy: "usr-006", registeredByRole: "asistente",
    approvalStatus: "pending", approvedBy: null, approvedAt: null,
    higiene: { tipo: "lavado_manos" },
  },
  {
    id: "dl-003", tenantId: "tenant-001", studentId: "alu-007", cursoId: "cur-002",
    date: MOCK_TODAY, category: "comida", timestamp: `${MOCK_TODAY}T09:00:00`,
    registeredBy: "usr-003", registeredByRole: "educadora",
    approvalStatus: "approved", approvedBy: "usr-003", approvedAt: `${MOCK_TODAY}T09:05:00`,
    comida: { tipo: "desayuno", cantidad: "casi_todo", observacion: "No quiso la fruta" },
  },
  {
    id: "dl-004", tenantId: "tenant-001", studentId: "alu-002", cursoId: "cur-003",
    date: MOCK_TODAY, category: "siesta", timestamp: `${MOCK_TODAY}T13:00:00`,
    registeredBy: "usr-006", registeredByRole: "asistente",
    approvalStatus: "pending", approvedBy: null, approvedAt: null,
    siesta: { inicio: "12:30", fin: "13:30", calidad: "profunda" },
  },
  {
    id: "dl-005", tenantId: "tenant-001", studentId: "alu-004", cursoId: "cur-003",
    date: MOCK_TODAY, category: "comida", timestamp: `${MOCK_TODAY}T12:30:00`,
    registeredBy: "usr-003", registeredByRole: "educadora",
    approvalStatus: "approved", approvedBy: "usr-003", approvedAt: `${MOCK_TODAY}T12:35:00`,
    comida: { tipo: "almuerzo", cantidad: "mitad", observacion: "Prefirió solo la sopa" },
  },
  {
    id: "dl-006", tenantId: "tenant-001", studentId: "alu-005", cursoId: "cur-001",
    date: MOCK_TODAY, category: "higiene", timestamp: `${MOCK_TODAY}T10:00:00`,
    registeredBy: "usr-002", registeredByRole: "educadora",
    approvalStatus: "approved", approvedBy: "usr-002", approvedAt: `${MOCK_TODAY}T10:00:00`,
    higiene: { tipo: "muda", observacion: "Sin novedades" },
  },
  {
    id: "dl-007", tenantId: "tenant-001", studentId: "alu-005", cursoId: "cur-001",
    date: MOCK_TODAY, category: "siesta", timestamp: `${MOCK_TODAY}T13:15:00`,
    registeredBy: "usr-006", registeredByRole: "asistente",
    approvalStatus: "pending", approvedBy: null, approvedAt: null,
    siesta: { inicio: "12:45", fin: "13:15", calidad: "intermitente", observacion: "Despertó dos veces" },
  },
  {
    id: "dl-008", tenantId: "tenant-001", studentId: "alu-008", cursoId: "cur-004",
    date: MOCK_TODAY, category: "actividad", timestamp: `${MOCK_TODAY}T10:30:00`,
    registeredBy: "usr-003", registeredByRole: "educadora",
    approvalStatus: "approved", approvedBy: "usr-003", approvedAt: `${MOCK_TODAY}T10:30:00`,
    actividad: { descripcion: "Pintura con témpera — tema: mi familia", participacion: "activa" },
  },
  {
    id: "dl-009", tenantId: "tenant-001", studentId: "alu-010", cursoId: "cur-003",
    date: MOCK_TODAY, category: "observacion", timestamp: `${MOCK_TODAY}T11:00:00`,
    registeredBy: "usr-006", registeredByRole: "asistente",
    approvalStatus: "rejected", approvedBy: "usr-003", approvedAt: `${MOCK_TODAY}T11:10:00`,
    observacion: { texto: "Se cayó en el patio, rasguño leve en la rodilla. Se aplicó parche curita." },
  },
  {
    id: "dl-010", tenantId: "tenant-001", studentId: "alu-001", cursoId: "cur-002",
    date: MOCK_YESTERDAY, category: "comida", timestamp: `${MOCK_YESTERDAY}T12:30:00`,
    registeredBy: "usr-003", registeredByRole: "educadora",
    approvalStatus: "approved", approvedBy: "usr-003", approvedAt: `${MOCK_YESTERDAY}T12:35:00`,
    comida: { tipo: "almuerzo", cantidad: "todo" },
  },
  {
    id: "dl-011", tenantId: "tenant-001", studentId: "alu-007", cursoId: "cur-002",
    date: MOCK_YESTERDAY, category: "siesta", timestamp: `${MOCK_YESTERDAY}T13:30:00`,
    registeredBy: "usr-003", registeredByRole: "educadora",
    approvalStatus: "approved", approvedBy: "usr-003", approvedAt: `${MOCK_YESTERDAY}T13:30:00`,
    siesta: { inicio: "12:30", fin: "13:30", calidad: "profunda" },
  },
];

// ─── Decreto 170 ───

export const decreto170Records: Decreto170Record[] = [
  {
    id: "d170-001", tenantId: "tenant-001", studentId: "alu-011",
    fueiId: "fuei-001", fueiUrl: "/docs/fuei_alu011_2025.pdf",
    diagnosticoCie10: "F80.2", diagnosticoDescripcion: "Trastorno Específico del Lenguaje (TEL) Mixto",
    neeType: "transitoria", fechaEvaluacion: "2025-03-15",
    fechaIngresoPie: "2025-03-15", fechaVencimientoReevaluacion: "2026-03-15",
    profesionalEvaluador: "Dra. Carmen Vega Soto", locked: true,
  },
  {
    id: "d170-002", tenantId: "tenant-001", studentId: "alu-008",
    fueiId: "fuei-002", fueiUrl: "/docs/fuei_alu008_2026.pdf",
    diagnosticoCie10: "F80.1", diagnosticoDescripcion: "Trastorno del Lenguaje Expresivo",
    neeType: "transitoria", fechaEvaluacion: "2026-01-20",
    fechaIngresoPie: "2026-01-20", fechaVencimientoReevaluacion: "2027-01-20",
    profesionalEvaluador: "Fga. María José Ruiz Tapia", locked: true,
  },
  {
    id: "d170-003", tenantId: "tenant-001", studentId: "alu-002",
    fueiId: null, fueiUrl: null,
    diagnosticoCie10: "F80.0", diagnosticoDescripcion: "Trastorno Específico de la Pronunciación",
    neeType: "transitoria", fechaEvaluacion: "2026-02-10",
    fechaIngresoPie: "2026-02-10", fechaVencimientoReevaluacion: "2027-02-10",
    profesionalEvaluador: "Fga. María José Ruiz Tapia", locked: true,
  },
  {
    id: "d170-004", tenantId: "tenant-001", studentId: "alu-006",
    fueiId: "fuei-004", fueiUrl: "/docs/fuei_alu006_2026.pdf",
    diagnosticoCie10: "F80.2", diagnosticoDescripcion: "TEL Mixto",
    neeType: "transitoria", fechaEvaluacion: "2025-07-05",
    fechaIngresoPie: "2025-07-05", fechaVencimientoReevaluacion: "2026-07-05",
    profesionalEvaluador: "Fga. María José Ruiz Tapia", locked: true,
  },
  {
    id: "d170-005", tenantId: "tenant-001", studentId: "alu-010",
    fueiId: "fuei-005", fueiUrl: "/docs/fuei_alu010_2025.pdf",
    diagnosticoCie10: "F93.0", diagnosticoDescripcion: "Trastorno de Ansiedad por Separación",
    neeType: "transitoria", fechaEvaluacion: "2025-09-01",
    fechaIngresoPie: "2025-09-01", fechaVencimientoReevaluacion: "2026-09-01",
    profesionalEvaluador: "Ps. Andrea Molina Castro", locked: true,
  },
];

export const fueiRecords: FueiRecord[] = [
  {
    id: "fuei-001", tenantId: "tenant-001", studentId: "alu-011", anio: 2025,
    rbd: "12345-6", nombreEstablecimiento: "Jardín Infantil Rayito de Sol",
    regionEstablecimiento: "Metropolitana", comunaEstablecimiento: "Maipú",
    rutAlumno: "24.456.789-0", nombreAlumno: "Joaquín Andrés Sepúlveda Contreras",
    fechaNacimientoAlumno: "2020-08-25", generoAlumno: "Masculino",
    nivelAlumno: "Primer Nivel Transición", cursoAlumno: "Primer Nivel Transición",
    neeType: "transitoria", diagnosticoCie10: "F80.2",
    diagnosticoDescripcion: "Trastorno Específico del Lenguaje (TEL) Mixto",
    fechaDeteccion: "2025-02-20", profesionalEvaluador: "Dra. Carmen Vega Soto",
    rutProfesional: "11.234.567-8", especialidadProfesional: "Neuróloga Infantil",
    apoyosEspecializados: ["Fonoaudiología (2 sesiones/semana)", "Psicología (1 sesión/semana)"],
    recursosAdicionales: "Material concreto para estimulación del lenguaje",
    adecuacionesCurriculares: "Adecuación no significativa en ámbito de comunicación",
    fechaIngresoPie: "2025-03-15", fechaReevaluacion: "2026-03-15",
    nombreApoderado: "Francisca Contreras Mora", rutApoderado: "17.789.012-3",
    firmaApoderado: true,
    locked: true, createdAt: "2025-03-15T10:00:00", updatedAt: "2025-03-15T10:00:00",
  },
];

export const specialistSessions: SpecialistSession[] = [
  {
    id: "ss-001", tenantId: "tenant-001", studentId: "alu-011",
    specialistId: "usr-004", specialistRole: "fonoaudiologo",
    type: "individual", date: "2026-06-09", durationMinutes: 30,
    objetivoTrabajado: "Producción de fonemas /r/ y /rr/ en posición inicial",
    actividadResumen: "Ejercicios de praxias linguales + repetición de palabras con /r/. Se usaron láminas y espejo.",
    nivelLogro: 3, observaciones: "Mejora en posición inicial, dificultad en trabantes.",
    locked: true, createdAt: "2026-06-09T10:30:00",
  },
  {
    id: "ss-002", tenantId: "tenant-001", studentId: "alu-011",
    specialistId: "usr-004", specialistRole: "fonoaudiologo",
    type: "individual", date: "2026-06-11", durationMinutes: 30,
    objetivoTrabajado: "Comprensión de oraciones complejas (2 instrucciones)",
    actividadResumen: "Juego de instrucciones con objetos concretos. 'Toma el lápiz rojo y ponlo dentro de la caja azul'.",
    nivelLogro: 4, observaciones: "Logra comprender instrucciones de 2 elementos. Avanzar a 3.",
    locked: true, createdAt: "2026-06-11T10:00:00",
  },
  {
    id: "ss-003", tenantId: "tenant-001", studentId: "alu-011",
    specialistId: "usr-005", specialistRole: "psicologo",
    type: "individual", date: "2026-06-10", durationMinutes: 45,
    objetivoTrabajado: "Habilidades sociales — turnos de conversación",
    actividadResumen: "Role-play con títeres. Trabajo en respetar turnos y escuchar al otro.",
    nivelLogro: 3, observaciones: "Participa con entusiasmo. Aún interrumpe en momentos de ansiedad.",
    locked: true, createdAt: "2026-06-10T11:00:00",
  },
  {
    id: "ss-004", tenantId: "tenant-001", studentId: "alu-008",
    specialistId: "usr-004", specialistRole: "fonoaudiologo",
    type: "individual", date: "2026-06-09", durationMinutes: 30,
    objetivoTrabajado: "Ampliación de vocabulario — categoría animales",
    actividadResumen: "Trabajo con láminas de animales de la granja. Nombrar, describir y clasificar.",
    nivelLogro: 4, observaciones: "Buen avance. Logra nombrar 15/18 animales presentados.",
    locked: true, createdAt: "2026-06-09T11:00:00",
  },
  {
    id: "ss-005", tenantId: "tenant-001", studentId: "alu-008",
    specialistId: "usr-004", specialistRole: "fonoaudiologo",
    type: "grupal", date: "2026-06-12", durationMinutes: 45,
    objetivoTrabajado: "Narración oral de cuentos breves",
    actividadResumen: "Sesión grupal con 3 alumnos. Escucharon cuento y recontaron con apoyo visual.",
    nivelLogro: 3, observaciones: "Participa activamente en grupo. Necesita apoyo con secuencias temporales.",
    locked: true, createdAt: "2026-06-12T10:00:00",
  },
  {
    id: "ss-006", tenantId: "tenant-001", studentId: "alu-002",
    specialistId: "usr-004", specialistRole: "fonoaudiologo",
    type: "individual", date: "2026-06-13", durationMinutes: 30,
    objetivoTrabajado: "Corrección articulatoria — fonema /s/",
    actividadResumen: "Posicionamiento lingual frente a espejo. Soplo dirigido y repetición de sílabas.",
    nivelLogro: 2, observaciones: "Dificultad persistente. Se sugiere mayor frecuencia de sesiones.",
    locked: true, createdAt: "2026-06-13T09:30:00",
  },
  {
    id: "ss-007", tenantId: "tenant-001", studentId: "alu-010",
    specialistId: "usr-005", specialistRole: "psicologo",
    type: "individual", date: "2026-06-12", durationMinutes: 45,
    objetivoTrabajado: "Regulación emocional — identificación de emociones",
    actividadResumen: "Trabajo con cartas de emociones. Identificar la emoción, contarla con una experiencia propia.",
    nivelLogro: 3, observaciones: "Identifica 4/6 emociones. Dificultad con 'frustración' y 'vergüenza'.",
    locked: true, createdAt: "2026-06-12T14:00:00",
  },
  {
    id: "ss-008", tenantId: "tenant-001", studentId: "alu-006",
    specialistId: "usr-004", specialistRole: "fonoaudiologo",
    type: "individual", date: "2026-06-16", durationMinutes: 30,
    objetivoTrabajado: "Comprensión de preguntas abiertas",
    actividadResumen: "Lectura de cuento corto seguido de preguntas qué/quién/dónde/por qué.",
    nivelLogro: 3, observaciones: "Responde a qué/quién/dónde. Dificultad con 'por qué'.",
    locked: false, createdAt: "2026-06-16T10:00:00",
  },
];

export function getDecreto170Alerts(): Decreto170Alert[] {
  const refDate = new Date("2026-06-17");
  const alerts: Decreto170Alert[] = [];
  for (const rec of decreto170Records) {
    const venc = new Date(rec.fechaVencimientoReevaluacion);
    const diffMs = venc.getTime() - refDate.getTime();
    const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const alumno = alumnos.find((a) => a.id === rec.studentId);
    let semaforo: "rojo" | "naranja" | "amarillo" | "verde";
    let urgencia: "critico" | "urgente" | "proximo";
    if (diasRestantes <= 0) { semaforo = "rojo"; urgencia = "critico"; }
    else if (diasRestantes <= 30) { semaforo = "naranja"; urgencia = "urgente"; }
    else if (diasRestantes <= 60) { semaforo = "amarillo"; urgencia = "proximo"; }
    else { semaforo = "verde"; urgencia = "proximo"; }
    alerts.push({
      studentId: rec.studentId,
      studentName: alumno ? `${alumno.nombres} ${alumno.apellidoPaterno}` : rec.studentId,
      diagnostico: rec.diagnosticoDescripcion,
      neeType: rec.neeType,
      fechaVencimiento: rec.fechaVencimientoReevaluacion,
      diasRestantes,
      urgencia,
      semaforo,
    });
  }
  return alerts.sort((a, b) => a.diasRestantes - b.diasRestantes);
}

export function getSessionsForStudent(studentId: string): SpecialistSession[] {
  return specialistSessions.filter((s) => s.studentId === studentId);
}

export function getSessionsForSpecialist(specialistId: string): SpecialistSession[] {
  return specialistSessions.filter((s) => s.specialistId === specialistId);
}

// ─── Calendario y Eventos ───

export const schoolEvents: SchoolEvent[] = [
  {
    id: "evt-001", tenantId: "tenant-001",
    title: "Reunión de Apoderados — Medio Menor",
    description: "Reunión semestral con apoderados del curso Los Exploradores.",
    startDate: "2026-06-20", endDate: "2026-06-20",
    type: "reunion", cursoId: "cur-002", isPublic: true, createdBy: "usr-001",
  },
  {
    id: "evt-002", tenantId: "tenant-001",
    title: "Día del Medio Ambiente",
    description: "Actividad de plantación de árboles en el patio del jardín. Todos los cursos.",
    startDate: "2026-06-22", endDate: "2026-06-22",
    type: "actividad_escolar", cursoId: null, isPublic: true, createdBy: "usr-001",
  },
  {
    id: "evt-003", tenantId: "tenant-001",
    title: "Feriado — San Pedro y San Pablo",
    description: "Feriado nacional. No hay clases.",
    startDate: "2026-06-29", endDate: "2026-06-29",
    type: "feriado", cursoId: null, isPublic: true, createdBy: "usr-001",
  },
  {
    id: "evt-004", tenantId: "tenant-001",
    title: "Cierre Primer Semestre",
    description: "Último día de clases del primer semestre 2026.",
    startDate: "2026-07-03", endDate: "2026-07-03",
    type: "hito", cursoId: null, isPublic: true, createdBy: "usr-001",
  },
  {
    id: "evt-005", tenantId: "tenant-001",
    title: "Reunión de Apoderados — Sala Cuna Mayor",
    description: "Reunión semestral con apoderados del curso Los Conejitos.",
    startDate: "2026-06-25", endDate: "2026-06-25",
    type: "reunion", cursoId: "cur-001", isPublic: true, createdBy: "usr-001",
  },
  {
    id: "evt-006", tenantId: "tenant-001",
    title: "Taller de Primeros Auxilios — Personal",
    description: "Capacitación obligatoria para todo el personal.",
    startDate: "2026-06-27", endDate: "2026-06-27",
    type: "actividad_escolar", cursoId: null, isPublic: false, createdBy: "usr-001",
  },
  {
    id: "evt-007", tenantId: "tenant-001",
    title: "Vacaciones de Invierno",
    description: "Receso escolar de invierno.",
    startDate: "2026-07-06", endDate: "2026-07-17",
    type: "feriado", cursoId: null, isPublic: true, createdBy: "usr-001",
  },
];

export function getUpcomingEvents(limit: number = 5): SchoolEvent[] {
  const ref = "2026-06-17";
  return schoolEvents
    .filter((e) => e.startDate >= ref)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit);
}

export function getMonthlyAttendanceStats(cursoId?: string) {
  const junRecords = attendanceRecords.filter((r) => {
    const inJune = r.date.startsWith("2026-06");
    return inJune && (!cursoId || r.cursoId === cursoId);
  });
  const total = junRecords.length;
  const present = junRecords.filter((r) => r.status === "present" || r.status === "late").length;
  const absent = junRecords.filter((r) => r.status === "absent").length;
  const excused = junRecords.filter((r) => r.status === "excused").length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  return { total, present, absent, excused, percentage };
}

// ─── Comunicaciones ───

export const communications: Communication[] = [
  {
    id: "comm-001", tenantId: "tenant-001",
    title: "Reunión de Apoderados — Primer Semestre",
    body: "Estimados apoderados, se les convoca a la reunión de cierre del primer semestre el día 20 de junio a las 18:00 hrs en el salón principal del jardín.",
    type: "circular", targetAudience: "todos", targetCursoId: null,
    questions: [], publishedAt: "2026-06-10T09:00:00", createdBy: "usr-001", isRead: false,
  },
  {
    id: "comm-002", tenantId: "tenant-001",
    title: "Actualización de Datos de Contacto",
    body: "Solicitamos a los apoderados actualizar sus datos de contacto (teléfono y email) en la secretaría del jardín antes del 25 de junio.",
    type: "circular", targetAudience: "todos", targetCursoId: null,
    questions: [], publishedAt: "2026-06-12T10:00:00", createdBy: "usr-001", isRead: false,
  },
  {
    id: "comm-003", tenantId: "tenant-001",
    title: "Encuesta: Satisfacción Primer Semestre",
    body: "Queremos conocer su opinión sobre el primer semestre 2026.",
    type: "encuesta", targetAudience: "todos", targetCursoId: null,
    questions: [
      { id: "q1", pregunta: "¿Cómo evalúa la calidad educativa del jardín?", opciones: ["Excelente", "Buena", "Regular", "Mala"], respuestas: { "Excelente": 12, "Buena": 8, "Regular": 2, "Mala": 0 } },
      { id: "q2", pregunta: "¿El personal es amable y cercano?", opciones: ["Siempre", "Casi siempre", "A veces", "Nunca"], respuestas: { "Siempre": 15, "Casi siempre": 5, "A veces": 2, "Nunca": 0 } },
      { id: "q3", pregunta: "¿Recomendaría este jardín a otros padres?", opciones: ["Sí, totalmente", "Probablemente sí", "No estoy seguro", "No"], respuestas: { "Sí, totalmente": 14, "Probablemente sí": 6, "No estoy seguro": 2, "No": 0 } },
    ],
    publishedAt: "2026-06-15T09:00:00", createdBy: "usr-001", isRead: false,
  },
  {
    id: "comm-004", tenantId: "tenant-001",
    title: "Paseo Educativo — Los Exploradores",
    body: "El curso Los Exploradores realizará un paseo educativo al Parque Bicentenario el día 23 de junio. Se requiere autorización firmada.",
    type: "circular", targetAudience: "curso", targetCursoId: "cur-002",
    questions: [], publishedAt: "2026-06-14T11:00:00", createdBy: "usr-001", isRead: false,
  },
];

// ─── Menús y Nutrición ───

export const menusSemanal: MenuSemanal[] = [
  {
    id: "menu-001", tenantId: "tenant-001",
    semanaInicio: "2026-06-15", semanaFin: "2026-06-19",
    cursoId: null, createdBy: "usr-001", createdAt: "2026-06-13T10:00:00",
    dias: [
      { dia: "lunes", desayuno: "Leche con cereal + fruta", almuerzo: "Pollo al jugo con arroz y ensalada", once: "Pan con palta + jugo", colacion: "Manzana" },
      { dia: "martes", desayuno: "Yogurt con granola", almuerzo: "Lentejas con arroz y ensalada", once: "Pan con mermelada + leche", colacion: "Plátano" },
      { dia: "miercoles", desayuno: "Leche con galletas", almuerzo: "Pescado al horno con puré", once: "Pan con queso + jugo", colacion: "Mandarina" },
      { dia: "jueves", desayuno: "Avena con miel", almuerzo: "Carbonada de vacuno", once: "Pan con mantequilla + leche", colacion: "Pera" },
      { dia: "viernes", desayuno: "Leche con tostadas", almuerzo: "Tallarines con salsa bolognesa", once: "Pan con jamón + jugo", colacion: "Uvas" },
    ],
  },
  {
    id: "menu-002", tenantId: "tenant-001",
    semanaInicio: "2026-06-22", semanaFin: "2026-06-26",
    cursoId: null, createdBy: "usr-001", createdAt: "2026-06-20T10:00:00",
    dias: [
      { dia: "lunes", desayuno: "Yogurt natural + fruta", almuerzo: "Estofado de pollo con papas", once: "Pan con huevo + leche", colacion: "Durazno" },
      { dia: "martes", desayuno: "Leche con cereal", almuerzo: "Porotos con riendas", once: "Pan con palta + jugo", colacion: "Manzana" },
      { dia: "miercoles", desayuno: "Avena con canela", almuerzo: "Merluza con arroz y ensalada", once: "Pan con queso + leche", colacion: "Naranja" },
      { dia: "jueves", desayuno: "Leche con galletas", almuerzo: "Pastel de choclo", once: "Pan con mermelada + jugo", colacion: "Plátano" },
      { dia: "viernes", desayuno: "Yogurt con granola", almuerzo: "Cazuela de ave", once: "Pan con mantequilla + leche", colacion: "Kiwi" },
    ],
  },
];

// ─── RRHH — Control de Horario ───

export const staffAttendanceRecords: StaffAttendance[] = [
  { id: "sa-001", tenantId: "tenant-001", userId: "usr-001", date: "2026-06-16", checkIn: "07:45", checkOut: "17:30", method: "web", horasTrabajadas: 9.75 },
  { id: "sa-002", tenantId: "tenant-001", userId: "usr-002", date: "2026-06-16", checkIn: "07:50", checkOut: "16:00", method: "qr", horasTrabajadas: 8.17 },
  { id: "sa-003", tenantId: "tenant-001", userId: "usr-003", date: "2026-06-16", checkIn: "08:00", checkOut: "16:15", method: "qr", horasTrabajadas: 8.25 },
  { id: "sa-004", tenantId: "tenant-001", userId: "usr-004", date: "2026-06-16", checkIn: "08:30", checkOut: "13:00", method: "web", horasTrabajadas: 4.5 },
  { id: "sa-005", tenantId: "tenant-001", userId: "usr-005", date: "2026-06-16", checkIn: "09:00", checkOut: "14:00", method: "web", horasTrabajadas: 5.0 },
  { id: "sa-006", tenantId: "tenant-001", userId: "usr-006", date: "2026-06-16", checkIn: "07:55", checkOut: "16:00", method: "qr", horasTrabajadas: 8.08 },
  { id: "sa-007", tenantId: "tenant-001", userId: "usr-008", date: "2026-06-16", checkIn: "08:00", checkOut: "17:00", method: "web", horasTrabajadas: 9.0 },
  { id: "sa-008", tenantId: "tenant-001", userId: "usr-001", date: "2026-06-17", checkIn: "07:40", checkOut: null, method: "web", horasTrabajadas: null },
  { id: "sa-009", tenantId: "tenant-001", userId: "usr-002", date: "2026-06-17", checkIn: "07:55", checkOut: null, method: "qr", horasTrabajadas: null },
  { id: "sa-010", tenantId: "tenant-001", userId: "usr-003", date: "2026-06-17", checkIn: "08:05", checkOut: null, method: "qr", horasTrabajadas: null },
];

// ─── Finanzas (Preliminar) ───

export const receipts: Receipt[] = [
  { id: "rec-001", tenantId: "tenant-001", studentId: "alu-001", type: "mensualidad", description: "Mensualidad Junio 2026", monto: 85000, fechaEmision: "2026-06-01", fechaVencimiento: "2026-06-10", status: "pagado", folio: "REC-2026-0001", createdBy: "usr-001" },
  { id: "rec-002", tenantId: "tenant-001", studentId: "alu-002", type: "mensualidad", description: "Mensualidad Junio 2026", monto: 85000, fechaEmision: "2026-06-01", fechaVencimiento: "2026-06-10", status: "pagado", folio: "REC-2026-0002", createdBy: "usr-001" },
  { id: "rec-003", tenantId: "tenant-001", studentId: "alu-004", type: "mensualidad", description: "Mensualidad Junio 2026", monto: 85000, fechaEmision: "2026-06-01", fechaVencimiento: "2026-06-10", status: "vencido", folio: "REC-2026-0003", createdBy: "usr-001" },
  { id: "rec-004", tenantId: "tenant-001", studentId: "alu-005", type: "mensualidad", description: "Mensualidad Junio 2026", monto: 85000, fechaEmision: "2026-06-01", fechaVencimiento: "2026-06-10", status: "pendiente", folio: "REC-2026-0004", createdBy: "usr-001" },
  { id: "rec-005", tenantId: "tenant-001", studentId: "alu-008", type: "material", description: "Kit de materiales 1er semestre", monto: 25000, fechaEmision: "2026-03-01", fechaVencimiento: "2026-03-15", status: "pagado", folio: "REC-2026-0005", createdBy: "usr-001" },
  { id: "rec-006", tenantId: "tenant-001", studentId: "alu-010", type: "mensualidad", description: "Mensualidad Junio 2026", monto: 85000, fechaEmision: "2026-06-01", fechaVencimiento: "2026-06-10", status: "pagado", folio: "REC-2026-0006", createdBy: "usr-001" },
];

// ─── Registro Seguro (Ingreso/Egreso) ───

export const securityLogs: SecurityLog[] = [
  {
    id: "sec-001", tenantId: "tenant-001",
    personId: "usr-001", personName: "María Fernanda Contreras López", personRut: "12.345.678-9",
    type: "entry", role: "staff",
    photoUrl: "/photos/record_entry_usr001_20260617_0745.jpg",
    timestamp: "2026-06-17T07:45:00", method: "web",
    relatedStudentId: null, relatedStudentName: null,
    verifiedAgainstAuthorized: false, registeredBy: "system",
  },
  {
    id: "sec-002", tenantId: "tenant-001",
    personId: "usr-002", personName: "Patricia Lagos Muñoz", personRut: "14.567.890-1",
    type: "entry", role: "staff",
    photoUrl: "/photos/record_entry_usr002_20260617_0755.jpg",
    timestamp: "2026-06-17T07:55:00", method: "qr",
    relatedStudentId: null, relatedStudentName: null,
    verifiedAgainstAuthorized: false, registeredBy: "system",
  },
  {
    id: "sec-003", tenantId: "tenant-001",
    personId: "ret-001", personName: "Carolina Soto Pérez", personRut: "16.789.012-3",
    type: "entry", role: "parent",
    photoUrl: "/photos/record_entry_ret001_20260617_0810.jpg",
    timestamp: "2026-06-17T08:10:00", method: "qr",
    relatedStudentId: "alu-001", relatedStudentName: "Sofía Antonia Muñoz",
    verifiedAgainstAuthorized: true, registeredBy: "usr-002",
  },
  {
    id: "sec-004", tenantId: "tenant-001",
    personId: "ret-003", personName: "Paola Araya Díaz", personRut: "17.890.123-4",
    type: "entry", role: "parent",
    photoUrl: "/photos/record_entry_ret003_20260617_0815.jpg",
    timestamp: "2026-06-17T08:15:00", method: "qr",
    relatedStudentId: "alu-002", relatedStudentName: "Benjamín Ignacio González",
    verifiedAgainstAuthorized: true, registeredBy: "usr-002",
  },
  {
    id: "sec-005", tenantId: "tenant-001",
    personId: "ret-001", personName: "Carolina Soto Pérez", personRut: "16.789.012-3",
    type: "exit", role: "parent",
    photoUrl: "/photos/record_exit_ret001_20260617_1600.jpg",
    timestamp: "2026-06-17T16:00:00", method: "qr",
    relatedStudentId: "alu-001", relatedStudentName: "Sofía Antonia Muñoz",
    verifiedAgainstAuthorized: true, registeredBy: "usr-003",
  },
  {
    id: "sec-006", tenantId: "tenant-001",
    personId: "visitor-001", personName: "Juan Pérez (Proveedor)", personRut: "10.111.222-3",
    type: "entry", role: "visitor",
    photoUrl: "/photos/record_entry_visitor001_20260617_0900.jpg",
    timestamp: "2026-06-17T09:00:00", method: "manual",
    relatedStudentId: null, relatedStudentName: null,
    verifiedAgainstAuthorized: false, registeredBy: "usr-008",
  },
  {
    id: "sec-007", tenantId: "tenant-001",
    personId: "visitor-001", personName: "Juan Pérez (Proveedor)", personRut: "10.111.222-3",
    type: "exit", role: "visitor",
    photoUrl: "/photos/record_exit_visitor001_20260617_0930.jpg",
    timestamp: "2026-06-17T09:30:00", method: "manual",
    relatedStudentId: null, relatedStudentName: null,
    verifiedAgainstAuthorized: false, registeredBy: "usr-008",
  },
];

export function validateSecurityQr(qrCode: string): { valid: boolean; retiree: typeof authorizedRetirees[0] | null; students: typeof alumnos } {
  const retiree = authorizedRetirees.find((r) => r.qrHash === qrCode && r.activo);
  if (!retiree) return { valid: false, retiree: null, students: [] };
  const studentIds = authorizedRetirees.filter((r) => r.rut === retiree.rut && r.activo).map((r) => r.studentId);
  const matchedStudents = alumnos.filter((a) => studentIds.includes(a.id));
  return { valid: true, retiree, students: matchedStudents };
}

// ─── Notificaciones (Push Engine) ───

export const deviceTokens: DeviceToken[] = [
  { id: "dt-001", userId: "usr-001", fcmToken: "fcm_token_director_android_001", deviceType: "android", lastUpdated: "2026-06-15T08:00:00", active: true },
  { id: "dt-002", userId: "usr-002", fcmToken: "fcm_token_educadora1_ios_001", deviceType: "ios", lastUpdated: "2026-06-14T09:00:00", active: true },
  { id: "dt-003", userId: "usr-004", fcmToken: "fcm_token_fono_web_001", deviceType: "web", lastUpdated: "2026-06-16T10:00:00", active: true },
  { id: "dt-004", userId: "parent-carolina", fcmToken: "fcm_token_parent_carolina_android", deviceType: "android", lastUpdated: "2026-06-17T07:30:00", active: true },
  { id: "dt-005", userId: "parent-paola", fcmToken: "fcm_token_parent_paola_ios", deviceType: "ios", lastUpdated: "2026-06-16T18:00:00", active: true },
];

export const notifications: Notification[] = [
  {
    id: "notif-001", tenantId: "tenant-001", event: "checkout_student", priority: "high",
    title: "Retiro de alumno: Sofía Muñoz",
    body: "Su hija Sofía Antonia Muñoz Soto ha sido retirada del jardín por Carolina Soto Pérez a las 16:00 hrs.",
    recipientUserId: "parent-carolina", recipientRole: "parent",
    relatedEntityId: "alu-001", status: "delivered",
    sentAt: "2026-06-17T16:00:30", readAt: null,
  },
  {
    id: "notif-002", tenantId: "tenant-001", event: "new_circular", priority: "normal",
    title: "Nueva circular: Reunión de Apoderados",
    body: "Se ha publicado una nueva circular sobre la reunión de apoderados del primer semestre.",
    recipientUserId: null, recipientRole: "parent",
    relatedEntityId: "comm-001", status: "sent",
    sentAt: "2026-06-10T09:01:00", readAt: null,
  },
  {
    id: "notif-003", tenantId: "tenant-001", event: "new_survey", priority: "normal",
    title: "Encuesta: Satisfacción Primer Semestre",
    body: "Tiene una encuesta pendiente de responder. Su opinión es importante para mejorar nuestro servicio.",
    recipientUserId: null, recipientRole: "parent",
    relatedEntityId: "comm-003", status: "delivered",
    sentAt: "2026-06-15T09:01:00", readAt: null,
  },
  {
    id: "notif-004", tenantId: "tenant-001", event: "emergency_alert", priority: "high",
    title: "ALERTA: Accidente registrado",
    body: "Se ha registrado un accidente menor en el patio. Alumno: Tomás Castillo. Se aplicaron primeros auxilios. Sin gravedad.",
    recipientUserId: "parent-javiera", recipientRole: "parent",
    relatedEntityId: "alu-010", status: "delivered",
    sentAt: "2026-06-17T11:15:00", readAt: "2026-06-17T11:20:00",
  },
  {
    id: "notif-005", tenantId: "tenant-001", event: "attendance_alert", priority: "high",
    title: "Alerta: 4 inasistencias consecutivas",
    body: "La alumna Isabella Rodríguez lleva 4 inasistencias consecutivas. Se recomienda contactar al apoderado.",
    recipientUserId: "usr-001", recipientRole: "director",
    relatedEntityId: "alu-003", status: "read",
    sentAt: "2026-06-16T08:35:00", readAt: "2026-06-16T09:00:00",
  },
  {
    id: "notif-006", tenantId: "tenant-001", event: "d170_reevaluation", priority: "normal",
    title: "Reevaluación D170 próxima a vencer",
    body: "El alumno Joaquín Sepúlveda tiene su reevaluación D170 vencida. Fecha límite: 2026-03-15.",
    recipientUserId: "usr-001", recipientRole: "director",
    relatedEntityId: "d170-001", status: "read",
    sentAt: "2026-06-15T08:00:00", readAt: "2026-06-15T08:30:00",
  },
  {
    id: "notif-007", tenantId: "tenant-001", event: "event_reminder", priority: "normal",
    title: "Recordatorio: Reunión de Apoderados mañana",
    body: "Recordatorio: Mañana 20 de junio a las 18:00 hrs se realizará la reunión de apoderados en el salón principal.",
    recipientUserId: null, recipientRole: "parent",
    relatedEntityId: "evt-001", status: "sent",
    sentAt: "2026-06-19T08:00:00", readAt: null,
  },
  {
    id: "notif-008", tenantId: "tenant-001", event: "checkout_student", priority: "high",
    title: "Retiro de alumno: Benjamín González",
    body: "Su hijo Benjamín Ignacio González Araya ha sido retirado por Paola Araya Díaz a las 16:30 hrs.",
    recipientUserId: "parent-paola", recipientRole: "parent",
    relatedEntityId: "alu-002", status: "sent",
    sentAt: "2026-06-17T16:30:00", readAt: null,
  },
];

// ─── Plantillas de Notificaciones Inteligentes ───

export const notificationTemplates: NotificationTemplate[] = [
  // Salud y Bienestar
  {
    id: "tpl-s01", category: "salud", title: "Alerta de salud: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, le informamos que su hijo/a {{child_name}} ha presentado {{sintoma}} durante la jornada de hoy {{date}}. Se le han brindado los primeros auxilios correspondientes. Le solicitamos que pueda acercarse al establecimiento o comunicarse con nosotros a la brevedad.",
    variables: ["child_name", "sintoma", "date"],
  },
  {
    id: "tpl-s02", category: "salud", title: "Administración de medicamento: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, le comunicamos que se ha administrado el medicamento {{medicamento}} a su hijo/a {{child_name}} a las {{time}} hrs, según la indicación médica registrada en su ficha. El estudiante se encuentra en buen estado.",
    variables: ["child_name", "medicamento", "time"],
  },
  {
    id: "tpl-s03", category: "salud", title: "Recordatorio: Control médico pendiente",
    messageBody: "Estimado/a apoderado/a, le recordamos que su hijo/a {{child_name}} tiene un control médico pendiente. Le solicitamos coordinar la cita y enviar el certificado correspondiente al establecimiento.",
    variables: ["child_name"],
  },
  {
    id: "tpl-s04", category: "salud", title: "Accidente menor registrado: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, le informamos que su hijo/a {{child_name}} sufrió un accidente menor el día {{date}} a las {{time}} hrs: {{descripcion}}. Se aplicaron los primeros auxilios correspondientes. El estudiante se encuentra estable. Quedamos atentos ante cualquier consulta.",
    variables: ["child_name", "date", "time", "descripcion"],
  },
  // Logística y Retiros
  {
    id: "tpl-l01", category: "logistica", title: "Retiro confirmado: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, le confirmamos que su hijo/a {{child_name}} ha sido retirado/a del establecimiento el día {{date}} a las {{time}} hrs por {{retira_nombre}}. El retiro fue verificado mediante código QR.",
    variables: ["child_name", "date", "time", "retira_nombre"],
  },
  {
    id: "tpl-l02", category: "logistica", title: "Cambio de horario: {{date}}",
    messageBody: "Estimado/a apoderado/a, le informamos que el día {{date}} el establecimiento modificará su horario de funcionamiento. La entrada será a las {{time}} hrs. Le agradecemos tomar las precauciones correspondientes para el traslado de su hijo/a {{child_name}}.",
    variables: ["child_name", "date", "time"],
  },
  {
    id: "tpl-l03", category: "logistica", title: "Solicitud de materiales",
    messageBody: "Estimado/a apoderado/a, le solicitamos enviar los siguientes materiales para su hijo/a {{child_name}} antes del día {{date}}: {{materiales}}. Estos serán utilizados en las actividades pedagógicas planificadas.",
    variables: ["child_name", "date", "materiales"],
  },
  // Pedagógico
  {
    id: "tpl-p01", category: "pedagogico", title: "Logro destacado: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, nos complace informarle que su hijo/a {{child_name}} ha demostrado un avance significativo en {{area}}: {{logro}}. Felicitamos al estudiante por su esfuerzo y dedicación.",
    variables: ["child_name", "area", "logro"],
  },
  {
    id: "tpl-p02", category: "pedagogico", title: "Informe de actividad: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, le compartimos que hoy {{date}}, su hijo/a {{child_name}} participó en la actividad \"{{actividad}}\". {{observacion}}. Le invitamos a conversar con el estudiante sobre esta experiencia.",
    variables: ["child_name", "date", "actividad", "observacion"],
  },
  {
    id: "tpl-p03", category: "pedagogico", title: "Observación conductual: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, deseamos compartir con usted una observación sobre el comportamiento de su hijo/a {{child_name}} durante la jornada del {{date}}: {{observacion}}. Le solicitamos su apoyo para reforzar este aspecto desde el hogar.",
    variables: ["child_name", "date", "observacion"],
  },
  // Solicitudes
  {
    id: "tpl-r01", category: "solicitudes", title: "Autorización requerida: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, le solicitamos firmar la autorización para que su hijo/a {{child_name}} pueda participar en {{actividad}} programada para el día {{date}}. Por favor, envíe el formulario firmado antes del {{fecha_limite}}.",
    variables: ["child_name", "actividad", "date", "fecha_limite"],
  },
  {
    id: "tpl-r02", category: "solicitudes", title: "Reunión de apoderados: {{date}}",
    messageBody: "Estimado/a apoderado/a, le invitamos cordialmente a la reunión de apoderados del curso de su hijo/a {{child_name}}, que se realizará el día {{date}} a las {{time}} hrs en {{lugar}}. Su asistencia es de gran importancia para el desarrollo educativo del estudiante.",
    variables: ["child_name", "date", "time", "lugar"],
  },
  {
    id: "tpl-r03", category: "solicitudes", title: "Certificado médico pendiente: {{child_name}}",
    messageBody: "Estimado/a apoderado/a, le recordamos que su hijo/a {{child_name}} registra {{dias}} día(s) de inasistencia. Le solicitamos presentar el certificado médico correspondiente para justificar las ausencias ante el registro oficial del establecimiento.",
    variables: ["child_name", "dias"],
  },
];

export const smartNotifications: SmartNotification[] = [
  {
    id: "sn-001", tenantId: "tenant-001", templateId: "tpl-s04", category: "salud", priority: "high",
    title: "Accidente menor registrado: Sofía Muñoz",
    body: "Estimado/a apoderado/a, le informamos que su hijo/a Sofía Antonia Muñoz sufrió un accidente menor el día 17/06/2026 a las 10:30 hrs: rasguño leve en la rodilla durante el recreo. Se aplicaron los primeros auxilios correspondientes. El estudiante se encuentra estable. Quedamos atentos ante cualquier consulta.",
    recipientStudentId: "alu-001", recipientStudentName: "Sofía Muñoz",
    sentBy: "usr-002", sentByRole: "educadora", sentAt: "2026-06-17T10:35:00", status: "delivered",
  },
  {
    id: "sn-002", tenantId: "tenant-001", templateId: "tpl-p01", category: "pedagogico", priority: "normal",
    title: "Logro destacado: Benjamín González",
    body: "Estimado/a apoderado/a, nos complace informarle que su hijo/a Benjamín Ignacio González ha demostrado un avance significativo en lenguaje oral: logra narrar una secuencia de 3 eventos con coherencia. Felicitamos al estudiante por su esfuerzo y dedicación.",
    recipientStudentId: "alu-002", recipientStudentName: "Benjamín González",
    sentBy: "usr-003", sentByRole: "educadora", sentAt: "2026-06-17T11:00:00", status: "sent",
  },
  {
    id: "sn-003", tenantId: "tenant-001", templateId: "tpl-l01", category: "logistica", priority: "high",
    title: "Retiro confirmado: Sofía Muñoz",
    body: "Estimado/a apoderado/a, le confirmamos que su hijo/a Sofía Antonia Muñoz ha sido retirado/a del establecimiento el día 17/06/2026 a las 16:00 hrs por Carolina Soto Pérez. El retiro fue verificado mediante código QR.",
    recipientStudentId: "alu-001", recipientStudentName: "Sofía Muñoz",
    sentBy: "usr-002", sentByRole: "educadora", sentAt: "2026-06-17T16:01:00", status: "delivered",
  },
  {
    id: "sn-004", tenantId: "tenant-001", templateId: "tpl-r03", category: "solicitudes", priority: "normal",
    title: "Certificado médico pendiente: Isabella Rodríguez",
    body: "Estimado/a apoderado/a, le recordamos que su hijo/a Isabella Rodríguez registra 4 día(s) de inasistencia. Le solicitamos presentar el certificado médico correspondiente para justificar las ausencias ante el registro oficial del establecimiento.",
    recipientStudentId: "alu-003", recipientStudentName: "Isabella Rodríguez",
    sentBy: "usr-001", sentByRole: "director", sentAt: "2026-06-17T08:30:00", status: "read",
  },
];

// ─── Chat / Mensajería Instantánea ───

export const chatConversations: ChatConversation[] = [
  {
    id: "conv-001", tenantId: "tenant-001",
    participantIds: ["usr-002", "parent-carolina"],
    participantNames: ["Patricia Lagos Muñoz", "Carolina Soto Pérez"],
    participantRoles: ["educadora", "apoderado"],
    relatedStudentId: "alu-001", relatedStudentName: "Sofía Muñoz",
    lastMessagePreview: "Sofía tuvo un excelente día hoy.",
    lastMessageAt: "2026-06-17T16:30:00", unreadCount: 0,
  },
  {
    id: "conv-002", tenantId: "tenant-001",
    participantIds: ["usr-003", "parent-paola"],
    participantNames: ["Claudia Ríos Sepúlveda", "Paola Araya Díaz"],
    participantRoles: ["educadora", "apoderado"],
    relatedStudentId: "alu-002", relatedStudentName: "Benjamín González",
    lastMessagePreview: "¿Podría enviar la autorización firmada?",
    lastMessageAt: "2026-06-17T14:20:00", unreadCount: 1,
  },
  {
    id: "conv-003", tenantId: "tenant-001",
    participantIds: ["usr-001", "usr-002"],
    participantNames: ["María Fernanda Contreras", "Patricia Lagos Muñoz"],
    participantRoles: ["director", "educadora"],
    relatedStudentId: null, relatedStudentName: null,
    lastMessagePreview: "Confirmado para la reunión del viernes.",
    lastMessageAt: "2026-06-17T11:00:00", unreadCount: 0,
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "msg-001", conversationId: "conv-001", tenantId: "tenant-001",
    senderId: "usr-002", senderName: "Patricia Lagos Muñoz", senderRole: "educadora",
    body: "Estimada apoderada, le informo que Sofía participó activamente en la actividad de arte de hoy. Realizó una pintura muy bonita.",
    imageUrl: null, imageCompressed: false,
    status: "read", sentAt: "2026-06-17T15:00:00", deliveredAt: "2026-06-17T15:00:05", readAt: "2026-06-17T15:10:00",
  },
  {
    id: "msg-002", conversationId: "conv-001", tenantId: "tenant-001",
    senderId: "parent-carolina", senderName: "Carolina Soto Pérez", senderRole: "apoderado",
    body: "Muchas gracias por informarme. ¿Cómo estuvo de ánimo durante el día?",
    imageUrl: null, imageCompressed: false,
    status: "read", sentAt: "2026-06-17T15:15:00", deliveredAt: "2026-06-17T15:15:02", readAt: "2026-06-17T15:20:00",
  },
  {
    id: "msg-003", conversationId: "conv-001", tenantId: "tenant-001",
    senderId: "usr-002", senderName: "Patricia Lagos Muñoz", senderRole: "educadora",
    body: "Sofía tuvo un excelente día hoy. Estuvo muy contenta y compartió con sus compañeros sin dificultad.",
    imageUrl: null, imageCompressed: false,
    status: "read", sentAt: "2026-06-17T16:30:00", deliveredAt: "2026-06-17T16:30:03", readAt: "2026-06-17T16:45:00",
  },
  {
    id: "msg-004", conversationId: "conv-002", tenantId: "tenant-001",
    senderId: "usr-003", senderName: "Claudia Ríos Sepúlveda", senderRole: "educadora",
    body: "Estimada apoderada, le recuerdo que necesitamos la autorización firmada para el paseo educativo del próximo lunes.",
    imageUrl: null, imageCompressed: false,
    status: "delivered", sentAt: "2026-06-17T14:00:00", deliveredAt: "2026-06-17T14:00:04", readAt: null,
  },
  {
    id: "msg-005", conversationId: "conv-002", tenantId: "tenant-001",
    senderId: "parent-paola", senderName: "Paola Araya Díaz", senderRole: "apoderado",
    body: "Disculpe la demora. La enviaré mañana a primera hora.",
    imageUrl: null, imageCompressed: false,
    status: "delivered", sentAt: "2026-06-17T14:20:00", deliveredAt: "2026-06-17T14:20:03", readAt: null,
  },
  {
    id: "msg-006", conversationId: "conv-002", tenantId: "tenant-001",
    senderId: "usr-003", senderName: "Claudia Ríos Sepúlveda", senderRole: "educadora",
    body: "¿Podría enviar la autorización firmada? Es necesaria antes del viernes para confirmar el transporte.",
    imageUrl: null, imageCompressed: false,
    status: "sent", sentAt: "2026-06-17T14:20:00", deliveredAt: null, readAt: null,
  },
  {
    id: "msg-007", conversationId: "conv-003", tenantId: "tenant-001",
    senderId: "usr-001", senderName: "María Fernanda Contreras", senderRole: "director",
    body: "Patricia, ¿puede confirmar su asistencia a la reunión del viernes a las 16:00?",
    imageUrl: null, imageCompressed: false,
    status: "read", sentAt: "2026-06-17T10:30:00", deliveredAt: "2026-06-17T10:30:02", readAt: "2026-06-17T10:45:00",
  },
  {
    id: "msg-008", conversationId: "conv-003", tenantId: "tenant-001",
    senderId: "usr-002", senderName: "Patricia Lagos Muñoz", senderRole: "educadora",
    body: "Confirmado para la reunión del viernes. Asistiré puntualmente.",
    imageUrl: null, imageCompressed: false,
    status: "read", sentAt: "2026-06-17T11:00:00", deliveredAt: "2026-06-17T11:00:03", readAt: "2026-06-17T11:05:00",
  },
  {
    id: "msg-009", conversationId: "conv-001", tenantId: "tenant-001",
    senderId: "usr-002", senderName: "Patricia Lagos Muñoz", senderRole: "educadora",
    body: "Le comparto una foto de la actividad de hoy.",
    imageUrl: "/photos/actividad_arte_sofia_20260617.jpg", imageCompressed: true,
    status: "delivered", sentAt: "2026-06-17T15:05:00", deliveredAt: "2026-06-17T15:05:04", readAt: null,
  },
];

// ─── SaaS / Superadmin ───

export const tenantsSaaS: TenantSaaS[] = [
  {
    id: "tenant-001", nombre: "Jardín Infantil Rayito de Sol", rbd: "12345-6",
    comuna: "Maipú", region: "Metropolitana", plan: "profesional",
    modulosActivos: ["asistencia", "diario", "cursos", "comunicaciones", "nutricion", "calendario", "reportes", "chat", "seguridad", "rrhh", "finanzas"],
    directorEmail: "maria.contreras@rayitodesol.cl",
    alumnosCount: 12, personalCount: 8, storageUsedMb: 245,
    createdAt: "2026-01-10", isActive: true,
  },
  {
    id: "tenant-002", nombre: "Escuela de Lenguaje Palabritas", rbd: "23456-7",
    comuna: "Puente Alto", region: "Metropolitana", plan: "enterprise",
    modulosActivos: ["asistencia", "diario", "cursos", "comunicaciones", "nutricion", "calendario", "reportes", "chat", "seguridad", "rrhh", "finanzas", "decreto170", "fonoaudiologia", "psicologia"],
    directorEmail: "director@palabritas.cl",
    alumnosCount: 45, personalCount: 15, storageUsedMb: 780,
    createdAt: "2025-08-15", isActive: true,
  },
  {
    id: "tenant-003", nombre: "Jardín Semillitas del Sur", rbd: "34567-8",
    comuna: "Temuco", region: "Araucanía", plan: "basico",
    modulosActivos: ["asistencia", "diario", "cursos"],
    directorEmail: "contacto@semillitas.cl",
    alumnosCount: 20, personalCount: 5, storageUsedMb: 120,
    createdAt: "2026-03-01", isActive: true,
  },
  {
    id: "tenant-004", nombre: "Jardín Arcoíris", rbd: "45678-9",
    comuna: "Valparaíso", region: "Valparaíso", plan: "profesional",
    modulosActivos: ["asistencia", "diario", "cursos", "comunicaciones", "calendario", "reportes", "seguridad"],
    directorEmail: "arcoiris@jardin.cl",
    alumnosCount: 30, personalCount: 10, storageUsedMb: 340,
    createdAt: "2026-02-20", isActive: false,
  },
];

export const auditLogs: AuditLog[] = [
  { id: "alog-001", tenantId: "tenant-001", userId: "usr-001", userName: "María Contreras", action: "LOGIN", detail: "Inicio de sesión exitoso", timestamp: "2026-06-17T07:45:00", ip: "192.168.1.10" },
  { id: "alog-002", tenantId: "tenant-001", userId: "usr-002", userName: "Patricia Lagos", action: "ATTENDANCE_REGISTER", detail: "Registró asistencia de 8 alumnos", timestamp: "2026-06-17T08:30:00", ip: "192.168.1.15" },
  { id: "alog-003", tenantId: "tenant-001", userId: "usr-001", userName: "María Contreras", action: "CIRCULAR_SENT", detail: "Publicó circular: Reunión de Apoderados", timestamp: "2026-06-17T09:00:00", ip: "192.168.1.10" },
  { id: "alog-004", tenantId: "global", userId: "usr-superadmin", userName: "Admin USAMI SaaS", action: "IMPERSONATION", detail: "Suplantó vista de Director en tenant-001 (soporte técnico)", timestamp: "2026-06-17T10:00:00", ip: "10.0.0.1" },
  { id: "alog-005", tenantId: "tenant-002", userId: "usr-superadmin", userName: "Admin USAMI SaaS", action: "PLAN_CHANGE", detail: "Cambió plan de tenant-002 de profesional a enterprise", timestamp: "2026-06-16T14:00:00", ip: "10.0.0.1" },
  { id: "alog-006", tenantId: "tenant-003", userId: "usr-superadmin", userName: "Admin USAMI SaaS", action: "TENANT_CREATED", detail: "Creó nuevo tenant: Jardín Semillitas del Sur", timestamp: "2026-03-01T10:00:00", ip: "10.0.0.1" },
];

export const supportTickets: SupportTicket[] = [
  { id: "tkt-001", tenantId: "tenant-001", tenantName: "Jardín Rayito de Sol", subject: "Error al exportar PDF de FUEI", description: "Al intentar exportar el FUEI del alumno Joaquín, la página queda en blanco.", status: "abierto", createdAt: "2026-06-17T09:30:00", createdBy: "María Contreras" },
  { id: "tkt-002", tenantId: "tenant-002", tenantName: "Escuela Palabritas", subject: "Solicitud de capacitación", description: "Necesitamos una capacitación para el equipo de fonoaudiólogas sobre el módulo D170.", status: "en_progreso", createdAt: "2026-06-15T11:00:00", createdBy: "Director Palabritas" },
  { id: "tkt-003", tenantId: "tenant-003", tenantName: "Jardín Semillitas", subject: "Activar módulo de Chat", description: "Queremos activar el módulo de chat para comunicarnos con los apoderados.", status: "resuelto", createdAt: "2026-06-10T08:00:00", createdBy: "Contacto Semillitas" },
];

// ─── Consola Sostenedor ───

export const liquidaciones: Liquidacion[] = [
  { id: "liq-001", tenantId: "tenant-001", userId: "usr-002", periodo: "2026-06", sueldoBase: 650000, bonos: 80000, descuentos: 145000, totalLiquido: 585000, status: "pagado", visadoPorDirector: true, pdfUrl: "/docs/liq_usr002_202606.pdf", createdAt: "2026-06-25" },
  { id: "liq-002", tenantId: "tenant-001", userId: "usr-003", periodo: "2026-06", sueldoBase: 650000, bonos: 50000, descuentos: 140000, totalLiquido: 560000, status: "visado_director", visadoPorDirector: true, pdfUrl: null, createdAt: "2026-06-25" },
  { id: "liq-003", tenantId: "tenant-001", userId: "usr-004", periodo: "2026-06", sueldoBase: 900000, bonos: 0, descuentos: 180000, totalLiquido: 720000, status: "borrador", visadoPorDirector: false, pdfUrl: null, createdAt: "2026-06-25" },
  { id: "liq-004", tenantId: "tenant-001", userId: "usr-006", periodo: "2026-06", sueldoBase: 450000, bonos: 30000, descuentos: 96000, totalLiquido: 384000, status: "pagado", visadoPorDirector: true, pdfUrl: "/docs/liq_usr006_202606.pdf", createdAt: "2026-06-25" },
  { id: "liq-005", tenantId: "tenant-001", userId: "usr-008", periodo: "2026-06", sueldoBase: 500000, bonos: 0, descuentos: 100000, totalLiquido: 400000, status: "aprobado", visadoPorDirector: true, pdfUrl: null, createdAt: "2026-06-25" },
];

export const leaveRequests: LeaveRequest[] = [
  { id: "lr-001", tenantId: "tenant-001", userId: "usr-002", userName: "Patricia Lagos Muñoz", type: "permiso_personal", startDate: "2026-06-20", endDate: "2026-06-20", days: 1, reason: "Trámite personal urgente", status: "aprobado_sostenedor", directorApproval: true, directorComment: "Autorizado", sostenedorApproval: true, replacementName: null, createdAt: "2026-06-18" },
  { id: "lr-002", tenantId: "tenant-001", userId: "usr-003", userName: "Claudia Ríos Sepúlveda", type: "licencia_medica", startDate: "2026-06-23", endDate: "2026-06-27", days: 5, reason: "Licencia médica por reposo", status: "visado_director", directorApproval: true, directorComment: "Licencia presentada", sostenedorApproval: null, replacementName: "Educadora de reemplazo pendiente", createdAt: "2026-06-19" },
  { id: "lr-003", tenantId: "tenant-001", userId: "usr-006", userName: "Rosa Tapia Morales", type: "vacaciones", startDate: "2026-07-06", endDate: "2026-07-17", days: 10, reason: "Vacaciones de invierno", status: "solicitado", directorApproval: null, directorComment: null, sostenedorApproval: null, replacementName: null, createdAt: "2026-06-17" },
  { id: "lr-004", tenantId: "tenant-001", userId: "usr-004", userName: "María José Ruiz Tapia", type: "capacitacion", startDate: "2026-07-01", endDate: "2026-07-02", days: 2, reason: "Curso de actualización en TEL", status: "rechazado", directorApproval: true, directorComment: "Aprobado por relevancia profesional", sostenedorApproval: false, replacementName: null, createdAt: "2026-06-15" },
];

export const sedeMetrics: SedeMetrics[] = [
  { tenantId: "tenant-001", nombre: "Jardín Infantil Rayito de Sol", asistenciaAlumnos: 87, asistenciaPersonal: 95, ingresosMes: 2850000, costosMes: 2100000, alumnosActivos: 12, personalActivo: 8, satisfaccionApoderados: 92, cumplimientoD170: 0, rotacionPersonal: 5 },
  { tenantId: "tenant-002", nombre: "Escuela de Lenguaje Palabritas", asistenciaAlumnos: 91, asistenciaPersonal: 97, ingresosMes: 5200000, costosMes: 3800000, alumnosActivos: 45, personalActivo: 15, satisfaccionApoderados: 88, cumplimientoD170: 85, rotacionPersonal: 8 },
  { tenantId: "tenant-003", nombre: "Jardín Semillitas del Sur", asistenciaAlumnos: 82, asistenciaPersonal: 90, ingresosMes: 1500000, costosMes: 1200000, alumnosActivos: 20, personalActivo: 5, satisfaccionApoderados: 95, cumplimientoD170: 0, rotacionPersonal: 0 },
];

// ─── Billing / Suscripciones ───

export const tenantBilling: TenantBilling[] = [
  { tenantId: "tenant-001", tenantName: "Jardín Infantil Rayito de Sol", plan: "profesional", status: "activo", monthlyAmount: 62500, nextPaymentDate: "2026-07-01", paymentMethod: "Tarjeta ****4532", lastPaymentDate: "2026-06-01", modulesIncluded: ["asistencia", "diario", "cursos", "comunicaciones", "nutricion", "calendario", "reportes", "chat", "seguridad", "rrhh", "finanzas"] },
  { tenantId: "tenant-002", tenantName: "Escuela de Lenguaje Palabritas", plan: "enterprise", status: "activo", monthlyAmount: 112500, nextPaymentDate: "2026-07-01", paymentMethod: "Transferencia bancaria", lastPaymentDate: "2026-06-01", modulesIncluded: ["asistencia", "diario", "cursos", "comunicaciones", "nutricion", "calendario", "reportes", "chat", "seguridad", "rrhh", "finanzas", "decreto170", "fonoaudiologia", "psicologia"] },
  { tenantId: "tenant-003", tenantName: "Jardín Semillitas del Sur", plan: "basico", status: "por_vencer", monthlyAmount: 25000, nextPaymentDate: "2026-06-20", paymentMethod: "Tarjeta ****7891", lastPaymentDate: "2026-05-20", modulesIncluded: ["asistencia", "diario", "cursos"] },
  { tenantId: "tenant-004", tenantName: "Jardín Arcoíris", plan: "profesional", status: "vencido", monthlyAmount: 62500, nextPaymentDate: "2026-06-01", paymentMethod: "Sin método", lastPaymentDate: "2026-05-01", modulesIncluded: [] },
];

// ─── Audit Log Detallado ───

export const detailedAuditLogs: DetailedAuditLog[] = [
  { id: "dal-001", tenantId: "tenant-001", actorId: "usr-001", actorName: "María Contreras", actorRole: "director", resource: "Student", action: "CREATE", oldValue: null, newValue: '{"nombres":"Sofía","rut":"23.456.789-0"}', clientIp: "192.168.1.10", timestamp: "2026-06-17T08:00:00" },
  { id: "dal-002", tenantId: "tenant-001", actorId: "usr-002", actorName: "Patricia Lagos", actorRole: "educadora", resource: "AttendanceRecord", action: "CREATE", oldValue: null, newValue: '{"studentId":"alu-001","status":"PRESENT"}', clientIp: "192.168.1.15", timestamp: "2026-06-17T08:30:00" },
  { id: "dal-003", tenantId: "tenant-001", actorId: "usr-001", actorName: "María Contreras", actorRole: "director", resource: "Communication", action: "CREATE", oldValue: null, newValue: '{"title":"Reunión de Apoderados","type":"CIRCULAR"}', clientIp: "192.168.1.10", timestamp: "2026-06-17T09:00:00" },
  { id: "dal-004", tenantId: "tenant-001", actorId: "usr-003", actorName: "Claudia Ríos", actorRole: "educadora", resource: "DailyLogEntry", action: "CREATE", oldValue: null, newValue: '{"category":"COMIDA","status":"approved"}', clientIp: "192.168.1.20", timestamp: "2026-06-17T09:15:00" },
  { id: "dal-005", tenantId: "tenant-001", actorId: "usr-001", actorName: "María Contreras", actorRole: "director", resource: "User", action: "UPDATE", oldValue: '{"role":"asistente"}', newValue: '{"role":"educadora"}', clientIp: "192.168.1.10", timestamp: "2026-06-17T10:00:00" },
  { id: "dal-006", tenantId: "tenant-001", actorId: "usr-sostenedor", actorName: "Roberto Méndez", actorRole: "sostenedor", resource: "Liquidacion", action: "UPDATE", oldValue: '{"status":"visado_director"}', newValue: '{"status":"aprobado"}', clientIp: "10.0.0.5", timestamp: "2026-06-17T11:00:00" },
  { id: "dal-007", tenantId: "global", actorId: "usr-superadmin", actorName: "Admin USAMI SaaS", actorRole: "superadmin", resource: "FeatureConfig", action: "UPDATE", oldValue: '{"chat":false}', newValue: '{"chat":true}', clientIp: "10.0.0.1", timestamp: "2026-06-16T14:30:00" },
  { id: "dal-008", tenantId: "tenant-002", actorId: "usr-superadmin", actorName: "Admin USAMI SaaS", actorRole: "superadmin", resource: "Tenant", action: "UPDATE", oldValue: '{"plan":"profesional"}', newValue: '{"plan":"enterprise"}', clientIp: "10.0.0.1", timestamp: "2026-06-15T16:00:00" },
];
