import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReceiptService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.receipt.findMany({
      where: { tenantId },
      include: { student: { select: { id: true, firstName: true, lastName: true, rut: true, courseId: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.receipt.create({
      data,
      include: { student: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.receipt.update({ where: { id }, data });
  }
}
