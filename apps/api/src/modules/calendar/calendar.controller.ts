import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('events')
export class CalendarController {
  constructor(private svc: CalendarService) {}

  @Get()
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.svc.findAll(tenantId);
  }

  @Post()
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.create({ ...body, tenantId, createdBy: userId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
