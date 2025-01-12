import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { RoleEntity, UserEntity } from '~/entities';
import { PasswordUtils } from '~/utils/secure';

import { DATABASE_TABLES, MIGRATIONS_TABLE } from '../_.constant';

/** Database initialization migration. */
export class Initialization1736111338015 implements MigrationInterface {
  /** Logger. */
  private logger = new Logger(Initialization1736111338015.name);

  async up(queryRunner: QueryRunner): Promise<void> {
    await this.updateMigrationsTable(queryRunner);

    for (const table of DATABASE_TABLES) {
      await queryRunner.createTable(table, true, true);
    }

    await this.seed(queryRunner);

    this.logger.log('Up migration executed');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of DATABASE_TABLES.reverse()) {
      await queryRunner.dropTable(table);
    }

    this.logger.log('Down migration executed');
  }

  private async updateMigrationsTable(queryRunner: QueryRunner): Promise<void> {
    for (const column of MIGRATIONS_TABLE.columns) {
      await queryRunner.changeColumn(MIGRATIONS_TABLE, column.name, column);
    }

    this.logger.debug('Migrations table updated');
  }

  private async seed(queryRunner: QueryRunner): Promise<void> {
    const adminRole = queryRunner.manager.create(RoleEntity, {
      name: 'admin',
      description: 'Administrator role',
    });
    const userRole = queryRunner.manager.create(RoleEntity, {
      name: 'user',
      description: 'User role',
    });

    const users = await Promise.all([
      (async () =>
        queryRunner.manager.create(UserEntity, {
          username: 'admin',
          password: await PasswordUtils.hash('Admin@123'),
          firstName: 'Admin',
          roles: [adminRole],
        }))(),

      (async () =>
        queryRunner.manager.create(UserEntity, {
          username: 'user1',
          password: await PasswordUtils.hash('User@123'),
          firstName: 'John',
          lastName: 'Doe',
          roles: [userRole],
        }))(),
      (async () =>
        queryRunner.manager.create(UserEntity, {
          username: 'user2',
          password: await PasswordUtils.hash('User@123'),
          firstName: 'Mary',
          lastName: 'Jane',
          roles: [userRole],
        }))(),
      (async () =>
        queryRunner.manager.create(UserEntity, {
          username: 'user3',
          password: await PasswordUtils.hash('User@123'),
          firstName: 'Bob',
          lastName: 'Smith',
          roles: [userRole],
        }))(),
    ]);

    adminRole.users = [users[0]];
    userRole.users = users.slice(1);

    await queryRunner.manager.save([adminRole, userRole, ...users]);
  }
}
