import { UseGuards } from '@nestjs/common';

import { JwtToken } from '../_.service.type';
import { LocalAuthGuard } from '../guards';
import { AccessTokenAuthGuard } from '../guards/_access-token-auth.guard';
import { RefreshTokenAuthGuard } from '../guards/_refresh-token-auth.guard';

/** Decorator to protect a route with local authentication. */
export const LocalAuth = () => UseGuards(LocalAuthGuard);

/** Decorator to protect a route with jwt authentication. */
export const JwtAuth = (type: keyof JwtToken = 'accessToken') => {
  return type === 'accessToken' ? UseGuards(AccessTokenAuthGuard) : UseGuards(RefreshTokenAuthGuard);
};
