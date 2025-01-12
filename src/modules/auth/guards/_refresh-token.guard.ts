import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { UserEntity } from '~/entities';

import { PUBLIC_GUARD, REFRESH_TOKEN_GUARD } from '../constants';

/** RefreshToken auth guard. */
@Injectable()
export class RefreshTokenGuard extends AuthGuard(REFRESH_TOKEN_GUARD) implements IAuthGuard {
  private logger = new Logger(RefreshTokenGuard.name);

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

  override handleRequest<TUser extends UserEntity>(error: Error, user: TUser): TUser {
    if (error) {
      throw error;
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
