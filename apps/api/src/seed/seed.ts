import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding USAMI EDU database...');

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // ─── Tenant 1: Jardín Infantil Rayito de Sol ───
  const tenant1 = await prisma.tenant.upsert({
    where: { rbd: '12345-6' },
    update: {},
    create: {
      id: 'tenant-001',
      name: 'Jardín Infantil Rayito de Sol',
      rbd: '12345-6',
      address: 'Av. Los Aromos 1234',
      comuna: 'Maipú',
      region: 'Metropolitana',
      phone: '+56 2 2345 6789',
      email: 'contacto@rayitodesol.cl',
      modality: 'JARDIN_INFANTIL',
      plan: 'PROFESIONAL',
    },
  });
  console.log(`  Tenant 1: ${tenant1.name}`);

  // ─── Tenant 2: Escuela de Lenguaje Arcoíris ───
  const tenant2 = await prisma.tenant.upsert({
    where: { rbd: '54321-0' },
    update: {},
    create: {
      id: 'tenant-002',
      name: 'Escuela de Lenguaje Arcoíris',
      rbd: '54321-0',
      address: 'Calle Los Cedros 567',
      comuna: 'La Florida',
      region: 'Metropolitana',
      phone: '+56 2 9876 5432',
      email: 'contacto@arcoiris.cl',
      modality: 'ESCUELA_LENGUAJE',
      plan: 'ENTERPRISE',
    },
  });
  console.log(`  Tenant 2: ${tenant2.name}`);

  // ─── Users Tenant 1 ───
  const usersT1 = [
    { id: 'usr-001', email: 'maria.contreras@rayitodesol.cl', fullName: 'María Fernanda Contreras López', rut: '12.345.678-9', role: 'DIRECTOR' as const, password: 'admin123' },
    { id: 'usr-002', email: 'patricia.lagos@rayitodesol.cl', fullName: 'Patricia Lagos Muñoz', rut: '14.567.890-1', role: 'EDUCADORA' as const, password: 'edu123' },
    { id: 'usr-003', email: 'claudia.rios@rayitodesol.cl', fullName: 'Claudia Ríos Sepúlveda', rut: '15.678.901-2', role: 'EDUCADORA' as const, password: 'edu123' },
    { id: 'usr-004', email: 'mjose.ruiz@rayitodesol.cl', fullName: 'María José Ruiz Tapia', rut: '16.789.012-3', role: 'FONOAUDIOLOGO' as const, password: 'fono123' },
    { id: 'usr-005', email: 'andrea.molina@rayitodesol.cl', fullName: 'Andrea Molina Castro', rut: '17.890.123-4', role: 'PSICOLOGO' as const, password: 'psico123' },
    { id: 'usr-006', email: 'rosa.tapia@rayitodesol.cl', fullName: 'Rosa Tapia Morales', rut: '13.456.789-0', role: 'ASISTENTE' as const, password: 'asist123' },
    { id: 'usr-008', email: 'lorena.silva@rayitodesol.cl', fullName: 'Lorena Silva Paredes', rut: '18.901.234-5', role: 'ADMINISTRATIVO' as const, password: 'admin123' },
  ];

  for (const u of usersT1) {
    await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant1.id, email: u.email } },
      update: {},
      create: { id: u.id, tenantId: tenant1.id, email: u.email, passwordHash: hash(u.password), fullName: u.fullName, rut: u.rut, role: u.role },
    });
  }
  console.log(`  Users T1: ${usersT1.length} created`);

  // ─── Users Tenant 2 ───
  const usersT2 = [
    { id: 'usr-t2-001', email: 'carlos.vega@arcoiris.cl', fullName: 'Carlos Vega Moreno', rut: '11.222.333-4', role: 'DIRECTOR' as const, password: 'admin123' },
    { id: 'usr-t2-002', email: 'javiera.ortega@arcoiris.cl', fullName: 'Javiera Ortega Bravo', rut: '12.333.444-5', role: 'EDUCADORA' as const, password: 'edu123' },
    { id: 'usr-t2-003', email: 'camila.soto@arcoiris.cl', fullName: 'Camila Soto Navarro', rut: '13.444.555-6', role: 'FONOAUDIOLOGO' as const, password: 'fono123' },
  ];

  for (const u of usersT2) {
    await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant2.id, email: u.email } },
      update: {},
      create: { id: u.id, tenantId: tenant2.id, email: u.email, passwordHash: hash(u.password), fullName: u.fullName, rut: u.rut, role: u.role },
    });
  }
  console.log(`  Users T2: ${usersT2.length} created`);

  // ─── Global tenant for superadmin ───
  await prisma.tenant.upsert({
    where: { rbd: '00000-0' },
    update: {},
    create: {
      id: 'global',
      name: 'USAMI SaaS Global',
      rbd: '00000-0',
      address: '-',
      comuna: '-',
      region: '-',
      phone: '-',
      email: 'admin@usami.cl',
    },
  });

  // ─── Superadmin ───
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: 'global', email: 'admin@usami.cl' } },
    update: {},
    create: {
      id: 'usr-superadmin',
      tenantId: 'global',
      email: 'admin@usami.cl',
      passwordHash: hash('superadmin123'),
      fullName: 'Admin USAMI SaaS',
      rut: '99.999.999-9',
      role: 'SUPERADMIN',
    },
  });
  console.log('  Superadmin created');

  // ─── Sostenedor (manages both tenants) ───
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant1.id, email: 'sostenedor@usami.cl' } },
    update: {},
    create: {
      id: 'usr-sostenedor',
      tenantId: tenant1.id,
      email: 'sostenedor@usami.cl',
      passwordHash: hash('sost123'),
      fullName: 'Roberto Fuentes Aránguiz',
      rut: '10.111.222-3',
      role: 'SOSTENEDOR',
    },
  });

  // Link sostenedor to both tenants
  await prisma.sostenedorTenant.upsert({
    where: { userId_tenantId: { userId: 'usr-sostenedor', tenantId: tenant1.id } },
    update: {},
    create: { userId: 'usr-sostenedor', tenantId: tenant1.id },
  });
  await prisma.sostenedorTenant.upsert({
    where: { userId_tenantId: { userId: 'usr-sostenedor', tenantId: tenant2.id } },
    update: {},
    create: { userId: 'usr-sostenedor', tenantId: tenant2.id },
  });
  console.log('  Sostenedor created (manages 2 sedes)');

  // ─── Courses Tenant 1 ───
  const coursesT1 = [
    { id: 'cur-001', officialLevel: 'SALA_CUNA_MAYOR' as const, creativeName: 'Los Conejitos', capacity: 20 },
    { id: 'cur-002', officialLevel: 'MEDIO_MENOR' as const, creativeName: 'Los Exploradores', capacity: 25 },
    { id: 'cur-003', officialLevel: 'MEDIO_MAYOR' as const, creativeName: 'Mundo de Voces', capacity: 25 },
    { id: 'cur-004', officialLevel: 'NT1' as const, creativeName: null, capacity: 30 },
    { id: 'cur-005', officialLevel: 'MEDIO_MENOR' as const, creativeName: 'Las Estrellitas', capacity: 25 },
  ];

  for (const c of coursesT1) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: { id: c.id, tenantId: tenant1.id, officialLevel: c.officialLevel, creativeName: c.creativeName, year: 2026, capacity: c.capacity },
    });
  }
  console.log(`  Courses T1: ${coursesT1.length} created`);

  // ─── Courses Tenant 2 ───
  const coursesT2 = [
    { id: 'cur-t2-001', officialLevel: 'MEDIO_MENOR' as const, creativeName: 'Los Pajaritos', capacity: 20 },
    { id: 'cur-t2-002', officialLevel: 'MEDIO_MAYOR' as const, creativeName: 'Los Delfines', capacity: 22 },
  ];

  for (const c of coursesT2) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: { id: c.id, tenantId: tenant2.id, officialLevel: c.officialLevel, creativeName: c.creativeName, year: 2026, capacity: c.capacity },
    });
  }
  console.log(`  Courses T2: ${coursesT2.length} created`);

  // ─── Students Tenant 1 ───
  const studentsT1 = [
    { id: 'alu-001', rut: '23.456.789-0', firstName: 'Sofía Antonia', lastName: 'Muñoz', motherLastName: 'Soto', birthDate: '2022-03-15', gender: 'FEMENINO' as const, courseId: 'cur-002' },
    { id: 'alu-002', rut: '23.567.890-1', firstName: 'Benjamín Ignacio', lastName: 'González', motherLastName: 'Araya', birthDate: '2021-07-22', gender: 'MASCULINO' as const, courseId: 'cur-003' },
    { id: 'alu-004', rut: '23.789.012-3', firstName: 'Martín Alonso', lastName: 'Silva', motherLastName: 'Fuentes', birthDate: '2021-01-10', gender: 'MASCULINO' as const, courseId: 'cur-003' },
    { id: 'alu-005', rut: '23.890.123-4', firstName: 'Agustina Paz', lastName: 'Hernández', motherLastName: 'Reyes', birthDate: '2023-05-20', gender: 'FEMENINO' as const, courseId: 'cur-001' },
    { id: 'alu-008', rut: '24.123.456-7', firstName: 'Mateo Nicolás', lastName: 'Rojas', motherLastName: 'Pizarro', birthDate: '2020-12-01', gender: 'MASCULINO' as const, courseId: 'cur-004' },
    { id: 'alu-010', rut: '24.345.678-9', firstName: 'Tomás Alejandro', lastName: 'Castillo', motherLastName: 'Vera', birthDate: '2021-04-17', gender: 'MASCULINO' as const, courseId: 'cur-003' },
    { id: 'alu-011', rut: '24.456.789-0', firstName: 'Joaquín Andrés', lastName: 'Sepúlveda', motherLastName: 'Contreras', birthDate: '2020-08-25', gender: 'MASCULINO' as const, courseId: 'cur-004' },
  ];

  for (const s of studentsT1) {
    const qrCode = `QR-${s.rut.replace(/\./g, '').replace('-', '')}-2026`;
    await prisma.student.upsert({
      where: { tenantId_rut: { tenantId: tenant1.id, rut: s.rut } },
      update: {},
      create: { id: s.id, tenantId: tenant1.id, rut: s.rut, firstName: s.firstName, lastName: s.lastName, motherLastName: s.motherLastName, birthDate: new Date(s.birthDate), gender: s.gender, courseId: s.courseId, qrCode },
    });
  }
  console.log(`  Students T1: ${studentsT1.length} created`);

  // ─── Students Tenant 2 ───
  const studentsT2 = [
    { id: 'alu-t2-001', rut: '25.111.222-3', firstName: 'Valentina', lastName: 'Pérez', motherLastName: 'Lagos', birthDate: '2022-06-10', gender: 'FEMENINO' as const, courseId: 'cur-t2-001' },
    { id: 'alu-t2-002', rut: '25.222.333-4', firstName: 'Lucas', lastName: 'Herrera', motherLastName: 'Díaz', birthDate: '2021-09-03', gender: 'MASCULINO' as const, courseId: 'cur-t2-002' },
    { id: 'alu-t2-003', rut: '25.333.444-5', firstName: 'Emilia', lastName: 'Vargas', motherLastName: 'Riquelme', birthDate: '2022-01-28', gender: 'FEMENINO' as const, courseId: 'cur-t2-001' },
  ];

  for (const s of studentsT2) {
    const qrCode = `QR-${s.rut.replace(/\./g, '').replace('-', '')}-2026`;
    await prisma.student.upsert({
      where: { tenantId_rut: { tenantId: tenant2.id, rut: s.rut } },
      update: {},
      create: { id: s.id, tenantId: tenant2.id, rut: s.rut, firstName: s.firstName, lastName: s.lastName, motherLastName: s.motherLastName, birthDate: new Date(s.birthDate), gender: s.gender, courseId: s.courseId, qrCode },
    });
  }
  console.log(`  Students T2: ${studentsT2.length} created`);

  // ─── Course Assignments ───
  await prisma.courseAssignment.upsert({
    where: { userId_courseId: { userId: 'usr-002', courseId: 'cur-001' } },
    update: {},
    create: { userId: 'usr-002', courseId: 'cur-001', role: 'TITULAR' },
  });
  await prisma.courseAssignment.upsert({
    where: { userId_courseId: { userId: 'usr-003', courseId: 'cur-002' } },
    update: {},
    create: { userId: 'usr-003', courseId: 'cur-002', role: 'TITULAR' },
  });

  // ─── Feature Flags (both tenants) ───
  const modules = ['asistencia', 'diario', 'cursos', 'comunicaciones', 'nutricion', 'calendario', 'reportes', 'chat', 'seguridad', 'rrhh', 'finanzas'];
  const modulesT2 = [...modules, 'decreto170', 'fonoaudiologia', 'psicologia'];

  for (const m of modules) {
    await prisma.featureConfig.upsert({
      where: { tenantId_moduleKey: { tenantId: tenant1.id, moduleKey: m } },
      update: {},
      create: { tenantId: tenant1.id, moduleKey: m, enabled: true },
    });
  }
  for (const m of modulesT2) {
    await prisma.featureConfig.upsert({
      where: { tenantId_moduleKey: { tenantId: tenant2.id, moduleKey: m } },
      update: {},
      create: { tenantId: tenant2.id, moduleKey: m, enabled: true },
    });
  }
  console.log(`  Feature flags: T1=${modules.length}, T2=${modulesT2.length} modules`);

  console.log('\nSeed completed successfully!');
  console.log('\nCredentials:');
  console.log('  Director T1:  maria.contreras@rayitodesol.cl / admin123');
  console.log('  Director T2:  carlos.vega@arcoiris.cl / admin123');
  console.log('  Educadora:    patricia.lagos@rayitodesol.cl / edu123');
  console.log('  Sostenedor:   sostenedor@usami.cl / sost123  (2 sedes)');
  console.log('  Superadmin:   admin@usami.cl / superadmin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
