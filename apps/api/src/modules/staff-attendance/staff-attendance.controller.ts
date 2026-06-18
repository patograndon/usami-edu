import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { StaffAttendanceService } from './staff-attendance.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('staff-attendance')
export class StaffAttendanceController {
  constructor(private svc: StaffAttendanceService) {}

  @Get()
  findAll(@CurrentUser('tenantId') tenantId: string, @Query('date') date?: string) {
    return this.svc.findAll(tenantId, date);
  }

  @Post('check-in')
  checkIn(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.checkIn({ ...body, tenantId, userId });
  }

  @Post('check-out')
  checkOut(@Body() body: { checkOut: string; date: string }, @CurrentUser('userId') userId: string) {
    return this.svc.checkOut(userId, body.date, body.checkOut);
  }
}
