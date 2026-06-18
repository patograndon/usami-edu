import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.schoolEvent.findMany({
      where: { tenantId },
      include: { course: { select: { id: true, officialLevel: true, creativeName: true } } },
      orderBy: { startDate: 'asc' },
    });
  }

  async create(data: any) {
    return this.prisma.schoolEvent.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.schoolEvent.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.schoolEvent.delete({ where: { id } });
  }
}
