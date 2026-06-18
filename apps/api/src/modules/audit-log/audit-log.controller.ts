import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private svc: AuditLogService) {}

  @Get()
  @Roles('SUPERADMIN', 'SOSTENEDOR', 'DIRECTOR')
  findAll(@CurrentUser('tenantId') tenantId: string, @CurrentUser('role') role: string, @Query('tenantId') queryTenantId?: string) {
    if (role === 'SUPERADMIN') return this.svc.findAll(queryTenantId);
    return this.svc.findByTenant(tenantId);
  }
}
