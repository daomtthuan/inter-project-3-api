import { applyDecorators, Controller, UseGuards } from '@nestjs/common';

import { Auth } from '../auth';
import { ADMIN_CONTROLLER_PREFIX } from './_.constant';
import { AdminGuard } from './_.guard';

/**
 * Decorator for admin controllers.
 *
 * @param prefix Controller prefix.
 */
export const AdminController = (prefix: string) => applyDecorators(Auth(), UseGuards(AdminGuard), Controller(`${ADMIN_CONTROLLER_PREFIX}/${prefix}`));
