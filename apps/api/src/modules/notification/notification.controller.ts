import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private svc: NotificationService) {}

  @Get()
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.svc.findAll(tenantId);
  }

  @Post()
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.create({ ...body, tenantId, sentById: userId });
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.svc.markRead(id);
  }

  @Get('templates')
  getTemplates() {
    return this.svc.getTemplates();
  }

  @Get('devices')
  getDeviceTokens(@CurrentUser('userId') userId: string) {
    return this.svc.getDeviceTokens(userId);
  }
}
