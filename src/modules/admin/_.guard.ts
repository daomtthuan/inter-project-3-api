import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { GuardAdminService } from './services';

/** Admin guard. */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    /** GuardAdminService. */
    private guardAdminService: GuardAdminService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.guardAdminService.validateUserRole(request);
  }
}
