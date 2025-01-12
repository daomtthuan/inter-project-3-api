import { Injectable, Logger } from '@nestjs/common';

import { RequestTypeWithUser } from '~/common/types/http';

/** Api service. */
@Injectable()
export class ApiService {
  private logger = new Logger(ApiService.name);

  validateUserRole({ user }: RequestTypeWithUser): boolean {
    if (user.roles?.some((role) => role.name === 'user')) {
      return true;
    }

    this.logger.debug('User has no "user" role');
    return false;
  }
}
