import { applyDecorators, UseGuards } from '@nestjs/common';

import { LocalGuard } from '../guards';
import { AccessTokenGuard } from '../guards/_access-token.guard';
import { RefreshTokenGuard } from '../guards/_refresh-token.guard';
import { PayloadModel } from '../models';

/** Decorator to protect a route with local authentication. */
export const LocalAuth = () => applyDecorators(UseGuards(LocalGuard));

/** Decorator to protect a route with jwt authentication. */
export const Auth = (type: PayloadModel['type'] = 'access') => applyDecorators(type === 'access' ? UseGuards(AccessTokenGuard) : UseGuards(RefreshTokenGuard));
