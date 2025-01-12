import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as entities from '~/entities';
import { EnvUtils, PathUtils } from '~/utils/core';

import { MIGRATIONS_TABLE } from './_.constant';
import { DatabaseModule } from './_.module';
import * as migrations from './migrations';

/** Database factory. */
export const DatabaseFactory = registerAs('DATABASE', (): TypeOrmModuleOptions => {
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
