import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StaffAttendanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, date?: string) {
    return this.prisma.staffAttendance.findMany({
      where: { tenantId, ...(date ? { date: new Date(date) } : {}) },
      include: { user: { select: { id: true, fullName: true, role: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async checkIn(data: { tenantId: string; userId: string; date: string; checkIn: string; method: string }) {
    const dateObj = new Date(data.date);
    return this.prisma.staffAttendance.upsert({
      where: { userId_date: { userId: data.userId, date: dateObj } },
      update: { checkIn: data.checkIn },
      create: { ...data, date: dateObj },
      include: { user: { select: { id: true, fullName: true, role: true } } },
    });
  }

  async checkOut(userId: string, date: string, checkOut: string) {
    const dateObj = new Date(date);
    const record = await this.prisma.staffAttendance.findUnique({
      where: { userId_date: { userId, date: dateObj } },
    });
    const hoursWorked = record?.checkIn
      ? (parseFloat(checkOut.replace(':', '.')) - parseFloat(record.checkIn.replace(':', '.')))
      : null;
    return this.prisma.staffAttendance.update({
      where: { userId_date: { userId, date: dateObj } },
      data: { checkOut, hoursWorked },
    });
  }
}
