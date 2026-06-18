import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async findByCourse(tenantId: string, courseId: string, date?: string) {
    return this.prisma.attendanceRecord.findMany({
      where: {
        tenantId,
        courseId,
        ...(date ? { date: new Date(date) } : {}),
      },
      include: { student: { select: { id: true, firstName: true, lastName: true, rut: true } } },
      orderBy: { registeredAt: 'desc' },
    });
  }

  async findByStudent(tenantId: string, studentId: string) {
    return this.prisma.attendanceRecord.findMany({
      where: { tenantId, studentId },
      orderBy: { date: 'desc' },
      take: 60,
    });
  }

  async upsert(data: { tenantId: string; studentId: string; courseId: string; date: string; status: any; checkInTime?: string; registeredBy: string }) {
    const dateObj = new Date(data.date);
    return this.prisma.attendanceRecord.upsert({
      where: { studentId_date: { studentId: data.studentId, date: dateObj } },
      update: { status: data.status, checkInTime: data.checkInTime },
      create: { ...data, date: dateObj },
    });
  }

  async bulkUpsert(records: { tenantId: string; studentId: string; courseId: string; date: string; status: any; registeredBy: string }[]) {
    const results = await Promise.all(records.map((r) => this.upsert(r)));
    return results;
  }
}
