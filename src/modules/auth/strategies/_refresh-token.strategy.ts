import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';

import { User } from '~/modules/entities';
import { RequestTypeWithUser } from '~/types/http';
import { EnvUtils } from '~/utils/core';

import { REFRESH_TOKEN_GUARD } from '../_.constant';
import { AuthService } from '../_.service';
import { PayloadModel } from '../models';

/** RefreshToken authentication strategy. */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, REFRESH_TOKEN_GUARD) implements Strategy {
  constructor(
    /** Auth service. */
    private authService: AuthService,
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: EnvUtils.getString('BASE_URL'),
      secretOrKey: EnvUtils.getString('JWT_REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
    } satisfies StrategyOptionsWithRequest);
  }

  async validate(req: RequestTypeWithUser, payload: PayloadModel): Promise<User | null> {
    return this.authService.validateJwtPayload(req, payload);
  }
}
