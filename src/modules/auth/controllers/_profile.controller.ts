import { Get, Req } from '@nestjs/common';

import { RequestWithUser } from '~/common/types/http';

import { Auth, AuthController } from '../decorators';
import { ProfileModel } from '../models';

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
  async getProfile(@Req() { user }: RequestWithUser): Promise<ProfileModel> {
    return ProfileModel.create(user);
  }
}
