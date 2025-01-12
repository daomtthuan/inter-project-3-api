import { applyDecorators, UseGuards } from '@nestjs/common';

import { AccessTokenGuard, LocalGuard, RefreshTokenGuard } from '../guards';
import { PayloadModel } from '../models';

/** Decorator to protect a route with local authentication. */
export const LocalAuth = () => applyDecorators(UseGuards(LocalGuard));

/** Decorator to protect a route with jwt authentication. */
export const Auth = (type: PayloadModel['type'] = 'access') => applyDecorators(type === 'access' ? UseGuards(AccessTokenGuard) : UseGuards(RefreshTokenGuard));
