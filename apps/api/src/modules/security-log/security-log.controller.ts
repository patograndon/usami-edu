import { Controller, Get, Post, Body } from '@nestjs/common';
import { SecurityLogService } from './security-log.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('security')
export class SecurityLogController {
  constructor(private svc: SecurityLogService) {}

  @Get('logs')
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.svc.findAll(tenantId);
  }

  @Post('logs')
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.create({ ...body, tenantId, registeredById: userId });
  }

  @Get('retirements')
  findRetirements(@CurrentUser('tenantId') tenantId: string) {
    return this.svc.findRetirements(tenantId);
  }

  @Post('retirements')
  createRetirement(@Body() body: any, @CurrentUser('tenantId') tenantId: string) {
    return this.svc.createRetirement({ ...body, tenantId });
  }
}
