import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions.js';

import { EnvUtils } from '~/utils/core';
import { PathUtils } from '~/utils/core/_path';

import * as entities from '../entities';
import { MIGRATIONS_TABLE } from './_.constant';
import { DatabaseModule } from './_.module';
import * as migrations from './migrations';

/** Database factory. */
export const DatabaseFactory = registerAs('DATABASE', (): SqliteConnectionOptions => {
  const logger = new Logger(DatabaseModule.module.name);

  const database = PathUtils.resolveDist(EnvUtils.getString('DATABASE_DATA_DIR'), EnvUtils.getString('DATABASE_NAME'));

  logger.debug(`${DatabaseFactory.KEY} loaded`, {
    database,
  });

  return {
    type: 'sqlite',
    database,
    entities,
    migrations,
    migrationsTableName: MIGRATIONS_TABLE.name,
    migrationsRun: true,
    logging: true,
  };
});
