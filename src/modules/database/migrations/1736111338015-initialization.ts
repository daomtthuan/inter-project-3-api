import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { PasswordUtils } from '~/utils/secure';

import { DATABASE_TABLES, MIGRATIONS_TABLE, ROLE_TABLE, USER_ROLES_TABLE, USER_TABLE } from '../_.constant';

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
    const {
      identifiers: [adminRole, userRole],
    } = await queryRunner.manager.insert(ROLE_TABLE.name, [
      { name: 'admin', description: 'Administrator role' },
      { name: 'user', description: 'Regular user role' },
    ]);
    this.logger.debug('Roles added');
    if (!adminRole || !userRole) {
      throw new Error('Failed to add roles');
    }

    const [{ identifiers: adminUsers }, { identifiers: users }] = await Promise.all([
      queryRunner.manager.insert(USER_TABLE.name, [
        {
          username: 'admin',
          password: await PasswordUtils.hash('Admin@123'),
          firstName: 'Admin',
        },
      ]),
      queryRunner.manager.insert(USER_TABLE.name, [
        {
          username: 'user1',
          password: await PasswordUtils.hash('User@123'),
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          username: 'user2',
          password: await PasswordUtils.hash('User@123'),
          firstName: 'Mary',
          lastName: 'Jane',
        },
        {
          username: 'user3',
          password: await PasswordUtils.hash('User@123'),
          firstName: 'Bob',
          lastName: 'Smith',
        },
      ]),
    ]);
    this.logger.debug('Users added');

    await Promise.all([
      ...adminUsers.map(async (user) => {
        await queryRunner.manager.insert(USER_ROLES_TABLE.name, {
          userId: user.id,
          roleId: adminRole.id,
        });
      }),
      ...users.map(async (user) => {
        await queryRunner.manager.insert(USER_ROLES_TABLE.name, {
          userId: user.id,
          roleId: userRole.id,
        });
      }),
    ]);
    this.logger.debug(`User roles added`);
  }
}
