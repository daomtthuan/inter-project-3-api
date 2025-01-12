import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ApiService } from './services/_api.service';

/** Api guard. */
@Injectable()
export class ApiGuard implements CanActivate {
  constructor(
    /** ApiService. */
    private apiService: ApiService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.apiService.validateUserRole(request);
  }
}
