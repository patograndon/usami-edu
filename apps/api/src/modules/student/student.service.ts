import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, courseId?: string) {
    return this.prisma.student.findMany({
      where: {
        tenantId,
        isActive: true,
        ...(courseId ? { courseId } : {}),
      },
      include: {
        course: true,
        healthRecord: { include: { medications: true } },
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async findById(id: string, callerTenantId: string, callerRole: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        course: true,
        healthRecord: { include: { medications: true } },
        guardians: true,
        emergencyContacts: true,
        familyMembers: true,
        clinicalProfile: { include: { fuei: true, sessions: true } },
      },
    });
    if (!student) throw new NotFoundException('Alumno no encontrado');
    if (callerRole !== 'SUPERADMIN' && callerRole !== 'SOSTENEDOR' && student.tenantId !== callerTenantId) {
      throw new ForbiddenException('No tiene acceso a datos de otro establecimiento');
    }
    return student;
  }

  async create(data: {
    tenantId: string; rut: string; firstName: string; lastName: string;
    motherLastName: string; birthDate: string; gender: any;
    courseId?: string;
  }) {
    if (data.courseId) {
      const course = await this.prisma.course.findFirst({
        where: { id: data.courseId, tenantId: data.tenantId },
      });
      if (!course) {
        throw new BadRequestException('Debe crear al menos un curso antes de matricular alumnos');
      }
    }

    const qrCode = `QR-${data.rut.replace(/\./g, '').replace('-', '')}-${new Date().getFullYear()}`;

    return this.prisma.student.create({
      data: {
        tenantId: data.tenantId,
        rut: data.rut,
        firstName: data.firstName,
        lastName: data.lastName,
        motherLastName: data.motherLastName,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        courseId: data.courseId || undefined,
        qrCode,
      },
      include: { course: true },
    });
  }

  async update(id: string, data: any, callerTenantId: string, callerRole: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Alumno no encontrado');
    if (callerRole !== 'SUPERADMIN' && callerRole !== 'SOSTENEDOR' && student.tenantId !== callerTenantId) {
      throw new ForbiddenException('No tiene acceso a datos de otro establecimiento');
    }
    if (data.birthDate) data.birthDate = new Date(data.birthDate);
    return this.prisma.student.update({ where: { id }, data });
  }
}
