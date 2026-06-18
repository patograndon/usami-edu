import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NutritionService {
  constructor(private prisma: PrismaService) {}

  async findMenus(tenantId: string) {
    return this.prisma.weeklyMenu.findMany({
      where: { tenantId },
      include: { days: { orderBy: { dayOfWeek: 'asc' } } },
      orderBy: { weekStart: 'desc' },
    });
  }

  async create(data: any) {
    const { days, ...rest } = data;
    return this.prisma.weeklyMenu.create({
      data: { ...rest, days: { create: days } },
      include: { days: { orderBy: { dayOfWeek: 'asc' } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.weeklyMenu.update({ where: { id }, data });
  }
}
