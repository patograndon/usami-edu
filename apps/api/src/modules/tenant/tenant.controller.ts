import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get()
  @Roles('SUPERADMIN', 'SOSTENEDOR')
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tenantService.findById(id);
  }

  @Post()
  @Roles('SUPERADMIN')
  create(@Body() body: any) {
    return this.tenantService.create(body);
  }

  @Patch(':id')
  @Roles('SUPERADMIN', 'SOSTENEDOR', 'DIRECTOR')
  update(@Param('id') id: string, @Body() body: any) {
    return this.tenantService.update(id, body);
  }

  @Get(':id/features')
  getFeatures(@Param('id') id: string) {
    return this.tenantService.getFeatures(id);
  }

  @Post(':id/features')
  @Roles('SUPERADMIN')
  toggleFeature(@Param('id') id: string, @Body() body: { moduleKey: string; enabled: boolean }) {
    return this.tenantService.toggleFeature(id, body.moduleKey, body.enabled);
  }
}
