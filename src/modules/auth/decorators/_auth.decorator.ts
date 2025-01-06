import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { LOCAL_ONLY_AUTH_GUARD } from '../_.constant';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';

/** Decorator to protect a route with local authentication. */
export const LocalAuth = () => UseGuards(LocalAuthGuard);

/** Decorator to protect a route with local authentication only. */
export const LocalAuthOnly = () => applyDecorators(SetMetadata(LOCAL_ONLY_AUTH_GUARD, true), LocalAuth());

/** Decorator to protect a route with jwt authentication. */
export const JwtAuth = () => UseGuards(JwtAuthGuard);
