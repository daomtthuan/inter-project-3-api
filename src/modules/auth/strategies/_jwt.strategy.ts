import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '~/modules/entities';
import { EnvUtils } from '~/utils/core';

import { JWT_AUTH_GUARD } from '../_.constant';
import { AuthService } from '../_.service';

/** JWT authentication strategy. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_AUTH_GUARD) {
  constructor(
    /** Auth service. */
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: EnvUtils.getString('JWT_SECRET'),
    });
  }

  async validate(payload: unknown): Promise<User | null> {
    return this.authService.validateJwtPayload(payload);
  }
}
