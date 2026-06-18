import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    if (!WRITE_METHODS.includes(method)) return next.handle();

    const user = request.user;
    if (!user) return next.handle();

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          await this.prisma.auditLog.create({
            data: {
              tenantId: user.tenantId || 'global',
              userId: user.userId,
              action: `${method} ${request.url}`,
              detail: JSON.stringify({ body: request.body }).substring(0, 500),
              ip: request.ip || request.connection?.remoteAddress || 'unknown',
            },
          });
        } catch {}
      }),
    );
  }
}
