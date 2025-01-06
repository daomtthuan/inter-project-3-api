import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { User } from '~/modules/entities';

import { LOCAL_AUTH_GUARD, PUBLIC_GUARD } from '../_.constant';

/** Local auth guard. */
@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_AUTH_GUARD) implements IAuthGuard {
  private logger = new Logger(LocalAuthGuard.name);

  constructor(
    /** Reflector. */
    private reflector: Reflector,
  ) {
    super();
  }

  override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_GUARD, [context.getHandler(), context.getClass()]);
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
