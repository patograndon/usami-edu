import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private svc: AttendanceService) {}

  @Get('course/:courseId')
  findByCourse(
    @CurrentUser('tenantId') tenantId: string,
    @Param('courseId') courseId: string,
    @Query('date') date?: string,
  ) {
    return this.svc.findByCourse(tenantId, courseId, date);
  }

  @Get('student/:studentId')
  findByStudent(@CurrentUser('tenantId') tenantId: string, @Param('studentId') studentId: string) {
    return this.svc.findByStudent(tenantId, studentId);
  }

  @Post()
  upsert(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.upsert({ ...body, tenantId, registeredBy: userId });
  }

  @Post('bulk')
  bulkUpsert(@Body() body: { records: any[] }, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.bulkUpsert(body.records.map((r) => ({ ...r, tenantId, registeredBy: userId })));
  }
}
