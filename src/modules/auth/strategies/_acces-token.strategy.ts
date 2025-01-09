import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

import { User } from '~/modules/entities';
import { RequestTypeWithUser } from '~/types/http';
import { EnvUtils } from '~/utils/core';

import { ACCESS_TOKEN_GUARD } from '../constants';
import { TokenAuthService } from '../services';

/** AccessToken authentication strategy. */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, ACCESS_TOKEN_GUARD) implements Strategy {
  constructor(
    /** TokenAuth service. */
    private tokenAuthService: TokenAuthService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: EnvUtils.getString('BASE_URL'),
      secretOrKey: EnvUtils.getString('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    } satisfies StrategyOptionsWithRequest);
  }

  async validate(req: RequestTypeWithUser, payload: unknown): Promise<User | null> {
    return this.tokenAuthService.validateJwtPayload(req, payload);
  }
}
