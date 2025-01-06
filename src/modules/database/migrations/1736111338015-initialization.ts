import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

import { PasswordUtils } from '~/utils/secure';

/** Database initialization migration. */
export class Initialization1736111338015 implements MigrationInterface {
  /** Logger. */
  private logger = new Logger(Initialization1736111338015.name);

  async up(queryRunner: QueryRunner): Promise<void> {
    await this.createUserTable(queryRunner);
    await this.createRoleTable(queryRunner);

    await this.createUserRole(queryRunner);

    this.logger.debug('Up migration executed');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropUserRole(queryRunner);

    await this.dropRoleTable(queryRunner);
    await this.dropUserTable(queryRunner);

    this.logger.debug('Down migration executed');
  }

  //#region user
  private async createUserTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'lastName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    this.logger.debug('User table created');

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_USERNAME',
        columnNames: ['username'],
        isUnique: true,
      }),
    );
    this.logger.debug('User username index created');

    await queryRunner.manager.insert('user', [
      {
        username: 'admin',
        password: await PasswordUtils.hash('Admin@123'),
        firstName: 'Admin',
      },
      {
        username: 'user',
        password: PasswordUtils.hash('User@123'),
        firstName: 'User',
      },
    ]);
    this.logger.debug('Users added');
  }

  private async dropUserTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
    this.logger.debug('User table dropped');
  }
  //#endregion

  // #region role
  private async createRoleTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    this.logger.debug('Role table created');

    await queryRunner.manager.insert('role', [
      { name: 'admin', description: 'Administrator role' },
      { name: 'user', description: 'Regular user role' },
    ]);
    this.logger.debug('Roles added');
  }

  private async dropRoleTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role');
    this.logger.debug('Role table dropped');
  }
  // #endregion

  //#region user_roles
  private async createUserRole(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_roles',
        columns: [
          {
            name: 'userId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'roleId',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
    this.logger.debug('User role table created');

    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    this.logger.debug('User id index created');

    await queryRunner.createForeignKey(
      'user_roles',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'CASCADE',
      }),
    );
    this.logger.debug('Role id index created');

    await queryRunner.manager.insert('user_roles', [
      { userId: 1, roleId: 1 },
      { userId: 2, roleId: 2 },
    ]);
    this.logger.debug('User roles added');
  }

  private async dropUserRole(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_roles');
    this.logger.debug('User role table dropped');
  }
  //#endregion
}
