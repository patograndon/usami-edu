import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('students')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  findAll(@CurrentUser('tenantId') tenantId: string, @Query('courseId') courseId?: string) {
    return this.studentService.findAll(tenantId, courseId);
  }

  @Get(':id')
  findById(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.studentService.findById(id, tenantId, role);
  }

  @Post()
  @Roles('DIRECTOR', 'EDUCADORA', 'ADMINISTRATIVO', 'SUPERADMIN')
  create(@Body() body: any, @CurrentUser('tenantId') tenantId: string) {
    return this.studentService.create({ ...body, tenantId });
  }

  @Patch(':id')
  @Roles('DIRECTOR', 'EDUCADORA', 'SUPERADMIN')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.studentService.update(id, body, tenantId, role);
  }
}
