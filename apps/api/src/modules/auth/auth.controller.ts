import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me/tenants')
  async getMyTenants(
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.authService.getMyTenants(userId, role, tenantId);
  }
}
