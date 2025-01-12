import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserEntity } from '~/entities';

import { LOCAL_AUTH_GUARD } from '../constants';
import { UserAuthService } from '../services';

/** Local authentication strategy. */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_AUTH_GUARD) {
  constructor(
    /** UserAuth service. */
    private userAuthService: UserAuthService,
  ) {
    super();
  }

  async validate(username: unknown, password: unknown): Promise<UserEntity | null> {
    return await this.userAuthService.validateUser(username, password);
  }
}
