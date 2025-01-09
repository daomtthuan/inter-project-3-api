import { applyDecorators, ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';

import { Auth } from '../auth';
import { API_CONTROLLER_PREFIX } from './_.constant';

/**
 * Decorator for api controllers.
 *
 * @param prefix Controller prefix.
 */
export const ApiController = (prefix: string) =>
  applyDecorators(Auth(), UseInterceptors(ClassSerializerInterceptor), Controller(`${API_CONTROLLER_PREFIX}/${prefix}`));
