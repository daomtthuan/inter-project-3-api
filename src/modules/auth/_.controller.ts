import { ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Post, Request, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { Except } from 'type-fest';

import { RequestTypeWithUser } from '~/types/http';

import { User } from '../entities';
import { AuthService } from './_.service';
import { JwtToken } from './_.service.type';
import { JwtAuth } from './decorators';
import { LocalAuthOnly } from './decorators/_auth.decorator';

/** Auth controller. */
@JwtAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    /** Auth service. */
    private auth: AuthService,
  ) {}

  /**
   * Sign in a user.
   *
   * @param req Request.
   *
   * @returns Sign in result.
   */
  @LocalAuthOnly()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Request() req: RequestTypeWithUser): Promise<JwtToken> {
    const accessToken = await this.auth.createToken(req);
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    return accessToken;
  }

  /**
   * Get user profile.
   *
   * @param req Request.
   *
   * @returns User profile.
   */
  @Get('profile')
  async getProfile(@Request() req: RequestTypeWithUser): Promise<Except<User, 'password'>> {
    return req.user;
  }
}
