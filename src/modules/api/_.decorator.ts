import { applyDecorators, Controller, UseGuards } from '@nestjs/common';

import { Auth } from '../auth';
import { API_CONTROLLER_PREFIX } from './_.constant';
import { ApiGuard } from './_.guard';

/**
 * Decorator for api controllers.
 *
 * @param prefix Controller prefix.
 */
export const ApiController = (prefix: string) => applyDecorators(Auth(), UseGuards(ApiGuard), Controller(`${API_CONTROLLER_PREFIX}/${prefix}`));
