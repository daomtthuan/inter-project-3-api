import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

import { RequestTypeWithUser } from '~/common/types/http';
import { UserEntity } from '~/entities';
import { EnvUtils } from '~/utils/core';

import { REFRESH_TOKEN_GUARD } from '../constants';
import { TokenAuthService } from '../services';

/** RefreshToken authentication strategy. */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, REFRESH_TOKEN_GUARD) implements Strategy {
  constructor(
    /** TokenAuth service. */
    private tokenAuthService: TokenAuthService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: EnvUtils.getString('BASE_URL'),
      secretOrKey: EnvUtils.getString('JWT_REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
    } satisfies StrategyOptionsWithRequest);
  }

  async validate(req: RequestTypeWithUser, payload: unknown): Promise<UserEntity | null> {
    return this.tokenAuthService.validateJwtPayload(req, payload);
  }
}
