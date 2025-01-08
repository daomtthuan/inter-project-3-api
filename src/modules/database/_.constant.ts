import { Table, TableColumnOptions } from 'typeorm';

/** Database types. */
export const TYPE = {
  TEXT: 'TEXT',
  REAL: 'REAL',
  NUMERIC: 'NUMERIC',
  INTEGER: 'INTEGER',
  BLOB: 'BLOB',
};

/** Migrations table name. */
export const MIGRATIONS_TABLE = new Table({
  name: '_migrations',
  columns: [
    {
      name: 'id',
      type: TYPE.INTEGER,
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment',
    },
    {
      name: 'timestamp',
      type: TYPE.NUMERIC,
    },
    {
      name: 'name',
      type: TYPE.TEXT,
    },
  ],
});

/** Identifier column. */
export const IDENTIFIER_COLUMN: TableColumnOptions = {
  name: 'id',
  type: TYPE.TEXT,
  isPrimary: true,
  isGenerated: true,
  generationStrategy: 'uuid',
};

/** Trackable columns. */
export const TRACKABLE_COLUMNS: TableColumnOptions[] = [
  {
    name: 'createdAt',
    type: TYPE.NUMERIC,
    isNullable: false,
    default: 'datetime()',
  },
  {
    name: 'updatedAt',
    type: TYPE.NUMERIC,
    isNullable: false,
    default: 'datetime()',
  },
];

/** Role table. */
export const ROLE_TABLE = new Table({
  name: 'role',
  columns: [
    IDENTIFIER_COLUMN,
    {
      name: 'name',
      type: TYPE.TEXT,
      isUnique: true,
    },
    {
      name: 'description',
      type: TYPE.TEXT,
      isNullable: true,
    },
    ...TRACKABLE_COLUMNS,
  ],
});

/** User table. */
export const USER_TABLE = new Table({
  name: 'user',
  columns: [
    IDENTIFIER_COLUMN,
    {
      name: 'username',
      type: TYPE.TEXT,
      isUnique: true,
      isNullable: false,
    },
    {
      name: 'password',
      type: TYPE.TEXT,
      isNullable: false,
    },
    {
      name: 'firstName',
      type: TYPE.TEXT,
      isNullable: false,
    },
    {
      name: 'lastName',
      type: TYPE.TEXT,
      isNullable: true,
    },
    {
      name: 'isActive',
      type: TYPE.NUMERIC,
      default: true,
      isNullable: false,
    },
    ...TRACKABLE_COLUMNS,
  ],
});

/** User roles table. */
export const USER_ROLES_TABLE = new Table({
  name: 'user_roles',
  columns: [
    {
      name: 'userId',
      type: TYPE.TEXT,
      isPrimary: true,
    },
    {
      name: 'roleId',
      type: TYPE.TEXT,
      isPrimary: true,
    },
    ...TRACKABLE_COLUMNS,
  ],
  foreignKeys: [
    {
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'user',
    },
    {
      columnNames: ['roleId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'role',
    },
  ],
});

/** Session table. */
export const SESSION_TABLE = new Table({
  name: 'session',
  columns: [
    {
      name: 'userId',
      type: TYPE.TEXT,
      isPrimary: true,
    },
    {
      name: 'refreshToken',
      type: TYPE.TEXT,
      isPrimary: true,
    },
    ...TRACKABLE_COLUMNS,
  ],
  foreignKeys: [
    {
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'user',
    },
  ],
});

/** Database tables. */
export const DATABASE_TABLES = [ROLE_TABLE, USER_TABLE, USER_ROLES_TABLE, SESSION_TABLE];
