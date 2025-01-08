import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';

import { User } from '~/modules/entities';
import { EnvUtils } from '~/utils/core';

import { REFRESH_TOKEN_GUARD } from '../_.constant';
import { AuthService } from '../_.service';

/** RefreshToken authentication strategy. */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, REFRESH_TOKEN_GUARD) implements Strategy {
  constructor(
    /** Auth service. */
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: EnvUtils.getString('BASE_URL'),
      secretOrKey: EnvUtils.getString('JWT_SECRET'),
      ignoreExpiration: false,
    } satisfies StrategyOptionsWithoutRequest);
  }

  async validate(payload: unknown): Promise<User | null> {
    return this.authService.validateJwtPayload(payload);
  }
}
