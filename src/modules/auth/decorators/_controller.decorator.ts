import { applyDecorators, Controller } from '@nestjs/common';

import { AUTH_CONTROLLER_PREFIX } from '../constants';

/**
 * Decorator for auth controllers.
 *
 * @param prefix Controller prefix.
 */
export const AuthController = (prefix: string) => applyDecorators(Controller(`${AUTH_CONTROLLER_PREFIX}/${prefix}`));
