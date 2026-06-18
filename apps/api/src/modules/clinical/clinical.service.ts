import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClinicalService {
  constructor(private prisma: PrismaService) {}

  async findProfiles(tenantId: string) {
    return this.prisma.clinicalProfile.findMany({
      where: { student: { tenantId } },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, rut: true, courseId: true } },
        fuei: true,
        sessions: { orderBy: { date: 'desc' }, take: 5 },
      },
    });
  }

  async findProfileByStudent(studentId: string) {
    return this.prisma.clinicalProfile.findUnique({
      where: { studentId },
      include: { fuei: true, sessions: { orderBy: { date: 'desc' } } },
    });
  }

  async findSessions(tenantId: string, studentId?: string) {
    return this.prisma.specialistSession.findMany({
      where: { tenantId, ...(studentId ? { studentId } : {}) },
      include: {
        specialist: { select: { id: true, fullName: true, role: true } },
        clinicalProfile: { include: { student: { select: { id: true, firstName: true, lastName: true } } } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async createSession(data: any) {
    return this.prisma.specialistSession.create({ data });
  }

  async findFueiRecords(tenantId: string) {
    return this.prisma.fueiRecord.findMany({
      where: { clinicalProfile: { student: { tenantId } } },
      include: {
        clinicalProfile: {
          include: { student: { select: { id: true, firstName: true, lastName: true, rut: true, courseId: true } } },
        },
      },
    });
  }

  async createFuei(data: any) {
    return this.prisma.fueiRecord.create({ data });
  }

  async updateFuei(id: string, data: any) {
    return this.prisma.fueiRecord.update({ where: { id }, data });
  }
}
