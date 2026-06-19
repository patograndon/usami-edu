import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/roles.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      name: 'USAMI EDU API',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    };
  }
}
