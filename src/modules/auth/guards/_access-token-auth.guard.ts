import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { User } from '~/modules/entities';

import { ACCESS_TOKEN_GUARD, PUBLIC_GUARD } from '../_.constant';

/** AccessToken auth guard. */
@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(ACCESS_TOKEN_GUARD) implements IAuthGuard {
  private logger = new Logger(AccessTokenAuthGuard.name);

  constructor(
    /** Reflector. */
    private reflector: Reflector,
  ) {
    super();
  }

  override canActivate(context: ExecutionContext): boolean | Observable<boolean> | Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_GUARD, targets);
    if (isPublic) {
      this.logger.debug(`Skip cause route has ${PUBLIC_GUARD}`);

      return true;
    }

    return super.canActivate(context);
  }

  override handleRequest<TUser extends User>(error: Error, user: TUser): TUser {
    if (error) {
      throw error;
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
