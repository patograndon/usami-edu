import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.notification.findMany({
      where: { tenantId },
      include: {
        sentBy: { select: { id: true, fullName: true, role: true } },
        relatedStudent: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { sentAt: 'desc' },
      take: 100,
    });
  }

  async create(data: any) {
    return this.prisma.notification.create({ data });
  }

  async markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { status: 'READ', readAt: new Date() } });
  }

  async getTemplates() {
    return this.prisma.notificationTemplate.findMany();
  }

  async getDeviceTokens(userId: string) {
    return this.prisma.deviceToken.findMany({ where: { userId, isActive: true } });
  }
}
