import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async findByCourse(tenantId: string, courseId: string) {
    return this.prisma.evaluation.findMany({
      where: { tenantId, courseId },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        evaluator: { select: { id: true, fullName: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.evaluation.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.evaluation.update({ where: { id }, data });
  }
}
