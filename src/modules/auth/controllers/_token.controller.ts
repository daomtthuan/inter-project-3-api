import { Post, Req, UnauthorizedException } from '@nestjs/common';

import { RequestWithUser } from '~/common/types/http';

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
  async getAccessToken(@Req() req: RequestWithUser): Promise<TokenModel> {
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
  async refreshToken(@Req() req: RequestWithUser): Promise<TokenModel> {
    const token = await this.tokenAuthService.createToken(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }
}
