import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true, email: true, fullName: true, rut: true,
        role: true, isActive: true, createdAt: true, tenantId: true,
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async findById(id: string, callerTenantId: string, callerRole: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { permissions: true, courseAssignments: { include: { course: true } } },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (callerRole !== 'SUPERADMIN' && callerRole !== 'SOSTENEDOR' && user.tenantId !== callerTenantId) {
      throw new ForbiddenException('No tiene acceso a datos de otro establecimiento');
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async create(data: { tenantId: string; email: string; password: string; fullName: string; rut: string; role: any }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const { password, ...rest } = data;
    return this.prisma.user.create({
      data: { ...rest, passwordHash },
      select: { id: true, email: true, fullName: true, role: true, tenantId: true },
    });
  }

  async update(id: string, data: any, callerTenantId: string, callerRole: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (callerRole !== 'SUPERADMIN' && callerRole !== 'SOSTENEDOR' && user.tenantId !== callerTenantId) {
      throw new ForbiddenException('No tiene acceso a datos de otro establecimiento');
    }
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, fullName: true, role: true },
    });
  }
}
