import { UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from '../guards';
import { AccessTokenAuthGuard } from '../guards/_access-token-auth.guard';
import { RefreshTokenAuthGuard } from '../guards/_refresh-token-auth.guard';
import { PayloadModel } from '../models';

/** Decorator to protect a route with local authentication. */
export const LocalAuth = () => UseGuards(LocalAuthGuard);

/** Decorator to protect a route with jwt authentication. */
export const JwtAuth = (type: PayloadModel['type'] = 'access') => {
  return type === 'access' ? UseGuards(AccessTokenAuthGuard) : UseGuards(RefreshTokenAuthGuard);
};
