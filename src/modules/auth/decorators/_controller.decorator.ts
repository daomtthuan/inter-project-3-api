import { applyDecorators, ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';

import { AUTH_CONTROLLER_PREFIX } from '../constants';

/**
 * Decorator for auth controllers.
 *
 * @param prefix Controller prefix.
 */
export const AuthController = (prefix: string) =>
  applyDecorators(UseInterceptors(ClassSerializerInterceptor), Controller(`${AUTH_CONTROLLER_PREFIX}/${prefix}`));
