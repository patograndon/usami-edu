import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding USAMI EDU database...');

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // ─── Tenant ───
  const tenant = await prisma.tenant.upsert({
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
  console.log(`  Tenant: ${tenant.name}`);

  // ─── Users ───
  const users = [
    { id: 'usr-001', email: 'maria.contreras@rayitodesol.cl', fullName: 'María Fernanda Contreras López', rut: '12.345.678-9', role: 'DIRECTOR' as const, password: 'admin123' },
    { id: 'usr-002', email: 'patricia.lagos@rayitodesol.cl', fullName: 'Patricia Lagos Muñoz', rut: '14.567.890-1', role: 'EDUCADORA' as const, password: 'edu123' },
    { id: 'usr-003', email: 'claudia.rios@rayitodesol.cl', fullName: 'Claudia Ríos Sepúlveda', rut: '15.678.901-2', role: 'EDUCADORA' as const, password: 'edu123' },
    { id: 'usr-004', email: 'mjose.ruiz@rayitodesol.cl', fullName: 'María José Ruiz Tapia', rut: '16.789.012-3', role: 'FONOAUDIOLOGO' as const, password: 'fono123' },
    { id: 'usr-005', email: 'andrea.molina@rayitodesol.cl', fullName: 'Andrea Molina Castro', rut: '17.890.123-4', role: 'PSICOLOGO' as const, password: 'psico123' },
    { id: 'usr-006', email: 'rosa.tapia@rayitodesol.cl', fullName: 'Rosa Tapia Morales', rut: '13.456.789-0', role: 'ASISTENTE' as const, password: 'asist123' },
    { id: 'usr-008', email: 'lorena.silva@rayitodesol.cl', fullName: 'Lorena Silva Paredes', rut: '18.901.234-5', role: 'ADMINISTRATIVO' as const, password: 'admin123' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: u.email } },
      update: {},
      create: {
        id: u.id,
        tenantId: tenant.id,
        email: u.email,
        passwordHash: hash(u.password),
        fullName: u.fullName,
        rut: u.rut,
        role: u.role,
      },
    });
  }
  console.log(`  Users: ${users.length} created`);

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

  // ─── Courses ───
  const courses = [
    { id: 'cur-001', officialLevel: 'SALA_CUNA_MAYOR' as const, creativeName: 'Los Conejitos', capacity: 20 },
    { id: 'cur-002', officialLevel: 'MEDIO_MENOR' as const, creativeName: 'Los Exploradores', capacity: 25 },
    { id: 'cur-003', officialLevel: 'MEDIO_MAYOR' as const, creativeName: 'Mundo de Voces', capacity: 25 },
    { id: 'cur-004', officialLevel: 'NT1' as const, creativeName: null, capacity: 30 },
    { id: 'cur-005', officialLevel: 'MEDIO_MENOR' as const, creativeName: 'Las Estrellitas', capacity: 25 },
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        tenantId: tenant.id,
        officialLevel: c.officialLevel,
        creativeName: c.creativeName,
        year: 2026,
        capacity: c.capacity,
      },
    });
  }
  console.log(`  Courses: ${courses.length} created`);

  // ─── Students ───
  const students = [
    { id: 'alu-001', rut: '23.456.789-0', firstName: 'Sofía Antonia', lastName: 'Muñoz', motherLastName: 'Soto', birthDate: '2022-03-15', gender: 'FEMENINO' as const, courseId: 'cur-002' },
    { id: 'alu-002', rut: '23.567.890-1', firstName: 'Benjamín Ignacio', lastName: 'González', motherLastName: 'Araya', birthDate: '2021-07-22', gender: 'MASCULINO' as const, courseId: 'cur-003' },
    { id: 'alu-004', rut: '23.789.012-3', firstName: 'Martín Alonso', lastName: 'Silva', motherLastName: 'Fuentes', birthDate: '2021-01-10', gender: 'MASCULINO' as const, courseId: 'cur-003' },
    { id: 'alu-005', rut: '23.890.123-4', firstName: 'Agustina Paz', lastName: 'Hernández', motherLastName: 'Reyes', birthDate: '2023-05-20', gender: 'FEMENINO' as const, courseId: 'cur-001' },
    { id: 'alu-008', rut: '24.123.456-7', firstName: 'Mateo Nicolás', lastName: 'Rojas', motherLastName: 'Pizarro', birthDate: '2020-12-01', gender: 'MASCULINO' as const, courseId: 'cur-004' },
    { id: 'alu-010', rut: '24.345.678-9', firstName: 'Tomás Alejandro', lastName: 'Castillo', motherLastName: 'Vera', birthDate: '2021-04-17', gender: 'MASCULINO' as const, courseId: 'cur-003' },
    { id: 'alu-011', rut: '24.456.789-0', firstName: 'Joaquín Andrés', lastName: 'Sepúlveda', motherLastName: 'Contreras', birthDate: '2020-08-25', gender: 'MASCULINO' as const, courseId: 'cur-004' },
  ];

  for (const s of students) {
    const qrCode = `QR-${s.rut.replace(/\./g, '').replace('-', '')}-2026`;
    await prisma.student.upsert({
      where: { tenantId_rut: { tenantId: tenant.id, rut: s.rut } },
      update: {},
      create: {
        id: s.id,
        tenantId: tenant.id,
        rut: s.rut,
        firstName: s.firstName,
        lastName: s.lastName,
        motherLastName: s.motherLastName,
        birthDate: new Date(s.birthDate),
        gender: s.gender,
        courseId: s.courseId,
        qrCode,
      },
    });
  }
  console.log(`  Students: ${students.length} created`);

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

  // ─── Feature Flags ───
  const modules = ['asistencia', 'diario', 'cursos', 'comunicaciones', 'nutricion', 'calendario', 'reportes', 'chat', 'seguridad', 'rrhh', 'finanzas'];
  for (const m of modules) {
    await prisma.featureConfig.upsert({
      where: { tenantId_moduleKey: { tenantId: tenant.id, moduleKey: m } },
      update: {},
      create: { tenantId: tenant.id, moduleKey: m, enabled: true },
    });
  }
  console.log(`  Feature flags: ${modules.length} modules enabled`);

  console.log('\nSeed completed successfully!');
  console.log('\nCredentials:');
  console.log('  Director: maria.contreras@rayitodesol.cl / admin123');
  console.log('  Educadora: patricia.lagos@rayitodesol.cl / edu123');
  console.log('  Superadmin: admin@usami.cl / superadmin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
