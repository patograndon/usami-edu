import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { CourseService } from './course.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.courseService.findAll(tenantId);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.courseService.findById(id, tenantId, role);
  }

  @Post()
  @Roles('DIRECTOR', 'SUPERADMIN')
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string) {
    return this.courseService.create({ ...body, tenantId });
  }

  @Patch(':id')
  @Roles('DIRECTOR', 'SUPERADMIN')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.courseService.update(id, body, tenantId, role);
  }

  @Get(':id/students')
  getStudents(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.courseService.getStudents(id, tenantId, role);
  }
}
