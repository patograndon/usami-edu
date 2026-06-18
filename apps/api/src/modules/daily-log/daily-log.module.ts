import { Module } from '@nestjs/common';
import { DailyLogController } from './daily-log.controller';
import { DailyLogService } from './daily-log.service';

@Module({ controllers: [DailyLogController], providers: [DailyLogService] })
export class DailyLogModule {}
