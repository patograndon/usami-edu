import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('receipts')
export class ReceiptController {
  constructor(private svc: ReceiptService) {}

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
}
