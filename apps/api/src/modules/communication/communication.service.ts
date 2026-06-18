import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.communication.findMany({
      where: { tenantId },
      include: { questions: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async create(data: any) {
    const { questions, ...rest } = data;
    return this.prisma.communication.create({
      data: {
        ...rest,
        questions: questions?.length ? { create: questions } : undefined,
      },
      include: { questions: true },
    });
  }
}
