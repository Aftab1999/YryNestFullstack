import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    if (apiKey === 'my-secret-key') {
      return true; // allow request
    }

    return false; // block request
  }
}
