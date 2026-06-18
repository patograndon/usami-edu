import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { StudentModule } from './modules/student/student.module';
import { CourseModule } from './modules/course/course.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { DailyLogModule } from './modules/daily-log/daily-log.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { ClinicalModule } from './modules/clinical/clinical.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ChatModule } from './modules/chat/chat.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { StaffAttendanceModule } from './modules/staff-attendance/staff-attendance.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { SecurityLogModule } from './modules/security-log/security-log.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    AuthModule,
    TenantModule,
    UserModule,
    StudentModule,
    CourseModule,
    AttendanceModule,
    DailyLogModule,
    EvaluationModule,
    ClinicalModule,
    CalendarModule,
    CommunicationModule,
    NotificationModule,
    ChatModule,
    NutritionModule,
    StaffAttendanceModule,
    ReceiptModule,
    SecurityLogModule,
    AuditLogModule,
  ],
})
export class AppModule {}
