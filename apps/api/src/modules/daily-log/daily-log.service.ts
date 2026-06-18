import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DailyLogService {
  constructor(private prisma: PrismaService) {}

  async findByCourse(tenantId: string, courseId: string, date?: string) {
    return this.prisma.dailyLogEntry.findMany({
      where: {
        tenantId,
        courseId,
        ...(date ? { date: new Date(date) } : {}),
      },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        registeredBy: { select: { id: true, fullName: true, role: true } },
        approvedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.dailyLogEntry.create({
      data,
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        registeredBy: { select: { id: true, fullName: true, role: true } },
      },
    });
  }

  async approve(id: string, userId: string, status: 'APPROVED' | 'REJECTED') {
    return this.prisma.dailyLogEntry.update({
      where: { id },
      data: { approvalStatus: status, approvedById: userId, approvedAt: new Date() },
    });
  }
}
