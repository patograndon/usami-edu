import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PUBLIC_KEY } from '../decorators/roles.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true;

    const role = user.role;
    const jwtTenantId = user.tenantId;

    // SUPERADMIN: access to everything, can override tenant via header
    if (role === 'SUPERADMIN') {
      const headerTenant = request.headers['x-tenant-id'];
      request.activeTenantId = headerTenant || jwtTenantId;
      return true;
    }

    // SOSTENEDOR: can switch between assigned tenants via header
    if (role === 'SOSTENEDOR') {
      const headerTenant = request.headers['x-tenant-id'];
      if (headerTenant && headerTenant !== jwtTenantId) {
        const allowed = await this.prisma.sostenedorTenant.findUnique({
          where: { userId_tenantId: { userId: user.userId, tenantId: headerTenant } },
        });
        if (!allowed) {
          throw new ForbiddenException('No tiene acceso a este establecimiento');
        }
        request.activeTenantId = headerTenant;
      } else {
        request.activeTenantId = jwtTenantId;
      }
      return true;
    }

    // All other roles: strictly locked to their JWT tenantId
    request.activeTenantId = jwtTenantId;
    return true;
  }
}
