import { Table, TableColumnOptions } from 'typeorm';

import { RoleEntity } from '~/entities';

/** Migrations table name. */
export const MIGRATIONS_TABLE = new Table({
  name: '_migrations',
  columns: [
    {
      name: 'id',
      type: 'integer',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment',
    },
    {
      name: 'timestamp',
      type: 'bigint',
    },
    {
      name: 'name',
      type: 'varchar',
    },
  ],
});

/** Identifier column. */
export const IDENTIFIER_COLUMN: TableColumnOptions = {
  name: 'id',
  type: 'varchar',
  isPrimary: true,
  isGenerated: true,
  generationStrategy: 'uuid',
};

/** Trackable columns. */
export const TRACKABLE_COLUMNS: TableColumnOptions[] = [
  {
    name: 'created_at',
    type: 'datetime',
    isNullable: false,
    default: 'datetime()',
  },
  {
    name: 'updated_at',
    type: 'datetime',
    isNullable: false,
    default: 'datetime()',
  },
];

/** Soft delete column. */
export const SOFT_DELETE_COLUMN: TableColumnOptions = {
  name: 'deleted_at',
  type: 'datetime',
  isNullable: true,
};

/** Role table. */
export const ROLE_TABLE = new Table({
  name: 'role',
  columns: [
    IDENTIFIER_COLUMN,
    {
      name: 'name',
      type: 'varchar',
      enum: RoleEntity.ROLES,
      isUnique: true,
      isNullable: false,
    },
    {
      name: 'description',
      type: 'varchar',
      isNullable: true,
    },
    ...TRACKABLE_COLUMNS,
    SOFT_DELETE_COLUMN,
  ],
});

/** User table. */
export const USER_TABLE = new Table({
  name: 'user',
  columns: [
    IDENTIFIER_COLUMN,
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
      name: 'first_name',
      type: 'varchar',
      isNullable: false,
    },
    {
      name: 'last_name',
      type: 'varchar',
      isNullable: true,
    },
    {
      name: 'is_active',
      type: 'boolean',
      isNullable: false,
      default: true,
    },
    ...TRACKABLE_COLUMNS,
    SOFT_DELETE_COLUMN,
  ],
});

/** User role table. */
export const USER_ROLE_TABLE = new Table({
  name: 'user_role',
  columns: [
    {
      name: 'user_id',
      type: 'varchar',
      isPrimary: true,
    },
    {
      name: 'role_id',
      type: 'varchar',
      isPrimary: true,
    },
    ...TRACKABLE_COLUMNS,
  ],
  foreignKeys: [
    {
      columnNames: ['user_id'],
      referencedTableName: 'user',
      referencedColumnNames: ['id'],
    },
    {
      columnNames: ['role_id'],
      referencedTableName: 'role',
      referencedColumnNames: ['id'],
    },
  ],
});

/** Session table. */
export const SESSION_TABLE = new Table({
  name: 'session',
  columns: [
    IDENTIFIER_COLUMN,
    {
      name: 'user_id',
      type: 'varchar',
      isNullable: false,
      isUnique: true,
    },
    {
      name: 'refresh_token',
      type: 'varchar',
      isNullable: false,
    },
    ...TRACKABLE_COLUMNS,
  ],
  foreignKeys: [
    {
      columnNames: ['user_id'],
      referencedTableName: 'user',
      referencedColumnNames: ['id'],
    },
  ],
});

/** Survey table. */
export const SURVEY_TABLE = new Table({
  name: 'survey',
  columns: [
    IDENTIFIER_COLUMN,
    {
      name: 'user_id',
      type: 'varchar',
      isNullable: false,
    },
    {
      name: 'rating',
      type: 'integer',
      isNullable: false,
    },
    {
      name: 'feedback',
      type: 'varchar',
      isNullable: true,
    },
    {
      name: 'is_anonymous',
      type: 'boolean',
      isNullable: false,
    },
    ...TRACKABLE_COLUMNS,
    SOFT_DELETE_COLUMN,
  ],
  foreignKeys: [
    {
      columnNames: ['user_id'],
      referencedTableName: 'user',
      referencedColumnNames: ['id'],
    },
  ],
});

/** Survey report table. */
export const SURVEY_REPORT_TABLE = new Table({
  name: 'survey_report',
  columns: [
    IDENTIFIER_COLUMN,
    {
      name: 'survey_id',
      type: 'varchar',
      isNullable: false,
      isUnique: true,
    },
    {
      name: 'user_id',
      type: 'varchar',
      isNullable: false,
    },
    {
      name: 'reason',
      type: 'varchar',
      isNullable: true,
    },
    ...TRACKABLE_COLUMNS,
  ],
  foreignKeys: [
    {
      columnNames: ['survey_id'],
      referencedTableName: 'survey',
      referencedColumnNames: ['id'],
    },
  ],
});

/** Database tables. */
export const DATABASE_TABLES = [ROLE_TABLE, USER_TABLE, USER_ROLE_TABLE, SESSION_TABLE, SURVEY_TABLE, SURVEY_REPORT_TABLE];
