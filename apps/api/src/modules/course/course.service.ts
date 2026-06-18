import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.course.findMany({
      where: { tenantId, isActive: true },
      include: { _count: { select: { students: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, callerTenantId: string, callerRole: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        students: {
          where: { isActive: true },
          include: { healthRecord: true },
          orderBy: { lastName: 'asc' },
        },
        assignments: { include: { user: { select: { id: true, fullName: true, role: true } } } },
        _count: { select: { students: true } },
      },
    });
    if (!course) throw new NotFoundException('Curso no encontrado');
    if (callerRole !== 'SUPERADMIN' && callerRole !== 'SOSTENEDOR' && course.tenantId !== callerTenantId) {
      throw new ForbiddenException('No tiene acceso a datos de otro establecimiento');
    }
    return course;
  }

  async create(data: { tenantId: string; officialLevel: any; creativeName?: string; year: number; capacity: number }) {
    return this.prisma.course.create({
      data,
      include: { _count: { select: { students: true } } },
    });
  }

  async update(id: string, data: any, callerTenantId: string, callerRole: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Curso no encontrado');
    if (callerRole !== 'SUPERADMIN' && callerRole !== 'SOSTENEDOR' && course.tenantId !== callerTenantId) {
      throw new ForbiddenException('No tiene acceso a datos de otro establecimiento');
    }
    return this.prisma.course.update({ where: { id }, data });
  }

  async getStudents(id: string, callerTenantId: string, callerRole: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Curso no encontrado');
    if (callerRole !== 'SUPERADMIN' && callerRole !== 'SOSTENEDOR' && course.tenantId !== callerTenantId) {
      throw new ForbiddenException('No tiene acceso a datos de otro establecimiento');
    }
    return this.prisma.student.findMany({
      where: { courseId: id, isActive: true },
      include: { healthRecord: { include: { medications: true } } },
      orderBy: { lastName: 'asc' },
    });
  }
}
