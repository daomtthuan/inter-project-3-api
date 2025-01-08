import { ClassSerializerInterceptor, Controller, Post, Request, UnauthorizedException, UseInterceptors } from '@nestjs/common';

import { RequestTypeWithUser } from '~/types/http';

import { AuthService } from '../_.service';
import { JwtToken } from '../_.service.type';
import { JwtAuth, LocalAuth } from '../decorators';

/** Auth controller. */
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth/token')
export class TokenAuthController {
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
  @LocalAuth()
  @Post()
  async getAccessToken(@Request() req: RequestTypeWithUser): Promise<JwtToken> {
    const token = await this.auth.createToken(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }

  @JwtAuth('refreshToken')
  @Post('refresh')
  async refreshToken(@Request() req: RequestTypeWithUser): Promise<JwtToken> {
    const token = await this.auth.createToken(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }
}
