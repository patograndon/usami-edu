import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('evaluations')
export class EvaluationController {
  constructor(private svc: EvaluationService) {}

  @Get()
  findByCourse(@CurrentUser('tenantId') tenantId: string, @Query('courseId') courseId: string) {
    return this.svc.findByCourse(tenantId, courseId);
  }

  @Post()
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.create({ ...body, tenantId, evaluatorId: userId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }
}
