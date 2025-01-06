import { JwtModule } from '@nestjs/jwt';

import { JwtAuthFactory } from './_.factory';

/** JwtAuth module. */
export const JwtAuthModule = JwtModule.registerAsync(JwtAuthFactory.asProvider());
