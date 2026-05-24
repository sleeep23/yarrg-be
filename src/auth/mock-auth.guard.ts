import type { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    req.user = {
      userId: 'local-user-1',
      displayName: 'user1',
    };
    return true;
  }
}
