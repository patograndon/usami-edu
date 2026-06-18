import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { DailyLogService } from './daily-log.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('daily-logs')
export class DailyLogController {
  constructor(private svc: DailyLogService) {}

  @Get('course/:courseId')
  findByCourse(@CurrentUser('tenantId') tenantId: string, @Param('courseId') courseId: string, @Query('date') date?: string) {
    return this.svc.findByCourse(tenantId, courseId, date);
  }

  @Post()
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string, @CurrentUser('role') role: string) {
    return this.svc.create({ ...body, tenantId, registeredById: userId, registeredByRole: role });
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body() body: { status: 'APPROVED' | 'REJECTED' }, @CurrentUser('userId') userId: string) {
    return this.svc.approve(id, userId, body.status);
  }
}
