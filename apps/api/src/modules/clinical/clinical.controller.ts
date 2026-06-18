import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ClinicalService } from './clinical.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('clinical')
export class ClinicalController {
  constructor(private svc: ClinicalService) {}

  @Get('profiles')
  findProfiles(@CurrentUser('tenantId') tenantId: string) {
    return this.svc.findProfiles(tenantId);
  }

  @Get('profiles/student/:studentId')
  findProfileByStudent(@Param('studentId') studentId: string) {
    return this.svc.findProfileByStudent(studentId);
  }

  @Get('sessions')
  findSessions(@CurrentUser('tenantId') tenantId: string, @Query('studentId') studentId?: string) {
    return this.svc.findSessions(tenantId, studentId);
  }

  @Post('sessions')
  createSession(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.createSession({ ...body, tenantId, specialistId: userId });
  }

  @Get('fuei')
  findFuei(@CurrentUser('tenantId') tenantId: string) {
    return this.svc.findFueiRecords(tenantId);
  }

  @Post('fuei')
  createFuei(@Body() body: any) {
    return this.svc.createFuei(body);
  }

  @Patch('fuei/:id')
  updateFuei(@Param('id') id: string, @Body() body: any) {
    return this.svc.updateFuei(id, body);
  }
}
