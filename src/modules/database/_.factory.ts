import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions.js';

import { EnvUtils } from '~/utils/core';
import { PathUtils } from '~/utils/core/_path';

import { Role, User } from '../entities';
import { DatabaseModule } from './_.module';
import { Initialization1736111338015 } from './migrations/1736111338015-initialization';

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
    migrationsRun: true,
    logging: true,
  };
});

const entities = [User, Role];

const migrations = [Initialization1736111338015];
