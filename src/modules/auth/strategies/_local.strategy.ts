import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '~/modules/entities';

import { LOCAL_AUTH_GUARD } from '../_.constant';
import { AuthService } from '../_.service';

/** Local authentication strategy. */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_AUTH_GUARD) {
  constructor(
    /** Auth service. */
    private authService: AuthService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User | null> {
    return await this.authService.validateUser(username, password);
  }
}
