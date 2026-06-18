import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SecurityLogService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.securityLog.findMany({
      where: { tenantId },
      include: { registeredBy: { select: { id: true, fullName: true } } },
      orderBy: { timestamp: 'desc' },
      take: 200,
    });
  }

  async create(data: any) {
    return this.prisma.securityLog.create({ data });
  }

  async findRetirements(tenantId: string) {
    return this.prisma.retirementLog.findMany({
      where: { tenantId },
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }

  async createRetirement(data: any) {
    return this.prisma.retirementLog.create({
      data,
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
    });
  }
}
