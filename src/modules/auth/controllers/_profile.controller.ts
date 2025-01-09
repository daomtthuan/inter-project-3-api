import { Get, Request } from '@nestjs/common';
import { Except } from 'type-fest';

import { User } from '~/modules/entities';
import { RequestTypeWithUser } from '~/types/http';

import { Auth, AuthController } from '../decorators';

/** Auth controller. */
@Auth()
@AuthController('profile')
export class ProfileAuthController {
  /**
   * Get user profile.
   *
   * @param request Request.
   *
   * @returns User profile.
   */
  @Get()
  async getProfile(@Request() { user }: RequestTypeWithUser): Promise<Except<User, 'password'>> {
    return user;
  }
}
