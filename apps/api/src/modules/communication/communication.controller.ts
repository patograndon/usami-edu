import { Controller, Get, Post, Body } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('communications')
export class CommunicationController {
  constructor(private svc: CommunicationService) {}

  @Get()
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.svc.findAll(tenantId);
  }

  @Post()
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.create({ ...body, tenantId, createdBy: userId });
  }
}
