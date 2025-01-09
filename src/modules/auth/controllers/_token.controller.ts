import { Post, Request, UnauthorizedException } from '@nestjs/common';

import { RequestTypeWithUser } from '~/types/http';

import { Auth, AuthController, LocalAuth } from '../decorators';
import { TokenModel } from '../models';
import { TokenAuthService } from '../services';

/** Auth controller. */
@AuthController('token')
export class TokenAuthController {
  constructor(
    /** TokenAuth service. */
    private tokenAuthService: TokenAuthService,
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
    const token = await this.tokenAuthService.createToken(req);
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
  @Auth('refresh')
  @Post('refresh')
  async refreshToken(@Request() req: RequestTypeWithUser): Promise<TokenModel> {
    const token = await this.tokenAuthService.createToken(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }
}
