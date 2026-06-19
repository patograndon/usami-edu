import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async getMyTenants(userId: string, role: string, homeTenantId: string) {
    if (role === 'SUPERADMIN') {
      return this.prisma.tenant.findMany({
        where: { isActive: true },
        select: { id: true, name: true, rbd: true, comuna: true },
        orderBy: { name: 'asc' },
      });
    }
    if (role === 'SOSTENEDOR') {
      const links = await this.prisma.sostenedorTenant.findMany({
        where: { userId },
        include: { tenant: { select: { id: true, name: true, rbd: true, comuna: true } } },
      });
      const tenants = links.map((l) => l.tenant);
      const home = await this.prisma.tenant.findUnique({
        where: { id: homeTenantId },
        select: { id: true, name: true, rbd: true, comuna: true },
      });
      if (home && !tenants.some((t) => t.id === home.id)) {
        tenants.unshift(home);
      }
      return tenants;
    }
    const home = await this.prisma.tenant.findUnique({
      where: { id: homeTenantId },
      select: { id: true, name: true, rbd: true, comuna: true },
    });
    return home ? [home] : [];
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
