import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('DIRECTOR', 'SUPERADMIN', 'SOSTENEDOR')
  findAll(@CurrentUser('tenantId') tenantId: string, @Query('tenantId') queryTenantId?: string, @CurrentUser('role') role?: string) {
    if (role === 'SUPERADMIN' || role === 'SOSTENEDOR') {
      return this.userService.findAll(queryTenantId || tenantId);
    }
    return this.userService.findAll(tenantId);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.userService.findById(id, tenantId, role);
  }

  @Post()
  @Roles('DIRECTOR', 'SUPERADMIN')
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('role') role: string) {
    const targetTenantId = role === 'SUPERADMIN' ? (body.tenantId || tenantId) : tenantId;
    return this.userService.create({ ...body, tenantId: targetTenantId });
  }

  @Patch(':id')
  @Roles('DIRECTOR', 'SUPERADMIN')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.userService.update(id, body, tenantId, role);
  }
}
