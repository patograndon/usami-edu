import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('nutrition')
export class NutritionController {
  constructor(private svc: NutritionService) {}

  @Get('menus')
  findMenus(@CurrentUser('tenantId') tenantId: string) {
    return this.svc.findMenus(tenantId);
  }

  @Post('menus')
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.create({ ...body, tenantId, createdBy: userId });
  }

  @Patch('menus/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }
}
