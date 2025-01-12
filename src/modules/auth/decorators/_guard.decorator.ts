import { applyDecorators, SetMetadata } from '@nestjs/common';

import { PUBLIC_GUARD } from '../constants';

/** Decorator to mark a route as public. */
export const Public = () => applyDecorators(SetMetadata(PUBLIC_GUARD, true));
