import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return data ? undefined : user;

    if (data === 'tenantId') {
      return request.activeTenantId || user.tenantId;
    }
    return data ? user[data] : user;
  },
);
