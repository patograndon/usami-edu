import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tenant.findMany({
      include: { _count: { select: { users: true, students: true, courses: true } } },
    });
  }

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        featureConfigs: true,
        _count: { select: { users: true, students: true, courses: true } },
      },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');
    return tenant;
  }

  async create(data: { name: string; rbd: string; address: string; comuna: string; region: string; phone: string; email: string; modality?: any; plan?: any }) {
    return this.prisma.tenant.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.tenant.update({ where: { id }, data });
  }

  async getFeatures(tenantId: string) {
    return this.prisma.featureConfig.findMany({ where: { tenantId } });
  }

  async toggleFeature(tenantId: string, moduleKey: string, enabled: boolean) {
    return this.prisma.featureConfig.upsert({
      where: { tenantId_moduleKey: { tenantId, moduleKey } },
      update: { enabled },
      create: { tenantId, moduleKey, enabled },
    });
  }
}
