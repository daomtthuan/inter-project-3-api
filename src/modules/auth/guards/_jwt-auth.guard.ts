import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { User } from '~/modules/entities';

import { JWT_AUTH_GUARD, LOCAL_ONLY_AUTH_GUARD, PUBLIC_GUARD } from '../_.constant';

/** JWT auth guard. */
@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_AUTH_GUARD) implements IAuthGuard {
  private logger = new Logger(JwtAuthGuard.name);

  constructor(
    /** Reflector. */
    private reflector: Reflector,
  ) {
    super();
  }

  override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const targets = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_GUARD, targets);
    if (isPublic) {
      this.logger.debug(`Skip cause route has ${PUBLIC_GUARD}`);

      return true;
    }

    const isLocalAuthOnly = this.reflector.getAllAndOverride<boolean>(LOCAL_ONLY_AUTH_GUARD, targets);
    if (isLocalAuthOnly) {
      this.logger.debug(`Skip cause route has ${LOCAL_ONLY_AUTH_GUARD}`);

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
