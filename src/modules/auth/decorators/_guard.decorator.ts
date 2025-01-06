import { SetMetadata } from '@nestjs/common';

import { PUBLIC_GUARD } from '../_.constant';

/** Decorator to mark a route as public. */
export const Public = () => SetMetadata(PUBLIC_GUARD, true);
