import { Injectable, Logger } from '@nestjs/common';

import { RequestWithUser } from '~/common/types/http';

/** Guard api service. */
@Injectable()
export class GuardApiService {
  private logger = new Logger(GuardApiService.name);

  validateUserRole({ user }: RequestWithUser): boolean {
    if (user.roles?.some((role) => role.name === 'user')) {
      return true;
    }

    this.logger.debug('User has no "user" role');
    return false;
  }
}
