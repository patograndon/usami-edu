import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId?: string) {
    return this.prisma.auditLog.findMany({
      where: tenantId ? { tenantId } : {},
      include: {
        user: { select: { id: true, fullName: true, role: true } },
        tenant: { select: { id: true, name: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 200,
    });
  }

  async findByTenant(tenantId: string) {
    return this.findAll(tenantId);
  }
}
