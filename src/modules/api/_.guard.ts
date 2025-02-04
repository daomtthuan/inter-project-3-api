import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { GuardApiService } from './services';

/** Api guard. */
@Injectable()
export class ApiGuard implements CanActivate {
  constructor(
    /** GuardApiService. */
    private guardApiService: GuardApiService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.guardApiService.validateUserRole(request);
  }
}
