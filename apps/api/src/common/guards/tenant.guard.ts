import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const GLOBAL_ROLES = ['SUPERADMIN'];
const MULTI_TENANT_ROLES = ['SOSTENEDOR'];

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true;

    if (GLOBAL_ROLES.includes(user.role)) return true;

    if (MULTI_TENANT_ROLES.includes(user.role)) return true;

    const paramId = request.params?.id;
    if (paramId) {
      const isOwned = await this.checkResourceBelongsToTenant(paramId, user.tenantId);
      if (isOwned === false) {
        throw new ForbiddenException('No tiene acceso a recursos de otro establecimiento');
      }
    }

    return true;
  }

  private async checkResourceBelongsToTenant(resourceId: string, tenantId: string): Promise<boolean | null> {
    const tables = [
      { model: 'student', field: 'tenantId' },
      { model: 'course', field: 'tenantId' },
      { model: 'user', field: 'tenantId' },
      { model: 'tenant', field: 'id' },
    ];

    for (const table of tables) {
      try {
        const record = await (this.prisma as any)[table.model].findUnique({
          where: { id: resourceId },
          select: { [table.field]: true },
        });
        if (record) {
          const recordTenantId = table.field === 'id' ? record.id : record[table.field];
          return recordTenantId === tenantId;
        }
      } catch {}
    }

    return null;
  }
}
