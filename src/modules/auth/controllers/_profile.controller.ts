import { ClassSerializerInterceptor, Controller, Get, Request, UseInterceptors } from '@nestjs/common';
import { Except } from 'type-fest';

import { User } from '~/modules/entities';
import { RequestTypeWithUser } from '~/types/http';

import { JwtAuth } from '../decorators';

/** Auth controller. */
@JwtAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth/profile')
export class ProfileAuthController {
  /**
   * Get user profile.
   *
   * @param req Request.
   *
   * @returns User profile.
   */
  @Get()
  async getProfile(@Request() req: RequestTypeWithUser): Promise<Except<User, 'password'>> {
    return req.user;
  }
}
