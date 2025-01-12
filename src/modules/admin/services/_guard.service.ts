import { Injectable, Logger } from '@nestjs/common';

import { RequestWithUser } from '~/common/types/http';

/** Guard admin service. */
@Injectable()
export class GuardAdminService {
  private logger = new Logger(GuardAdminService.name);

  validateUserRole({ user }: RequestWithUser): boolean {
    if (user.roles?.some((role) => role.name === 'admin')) {
      return true;
    }

    this.logger.debug('User has no "admin" role');
    return false;
  }
}
