import { ClassSerializerInterceptor, Controller, Post, Request, UnauthorizedException, UseInterceptors } from '@nestjs/common';

import { RequestTypeWithUser } from '~/types/http';

import { AuthService } from '../_.service';
import { JwtAuth, LocalAuth } from '../decorators';
import { TokenModel } from '../models';

/** Auth controller. */
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth/token')
export class TokenAuthController {
  constructor(
    /** Auth service. */
    private auth: AuthService,
  ) {}

  /**
   * Get Token.
   *
   * @param req Request.
   *
   * @returns Token.
   */
  @LocalAuth()
  @Post()
  async getAccessToken(@Request() req: RequestTypeWithUser): Promise<TokenModel> {
    const token = await this.auth.createToken(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }

  /**
   * Refresh Token.
   *
   * @param req Request.
   *
   * @returns Token.
   */
  @JwtAuth('refresh')
  @Post('refresh')
  async refreshToken(@Request() req: RequestTypeWithUser): Promise<TokenModel> {
    const token = await this.auth.createToken(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }
}
