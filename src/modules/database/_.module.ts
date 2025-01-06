import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseFactory } from './_.factory';

/** Database module. */
export const DatabaseModule = TypeOrmModule.forRootAsync(DatabaseFactory.asProvider());
