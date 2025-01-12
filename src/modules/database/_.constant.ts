import { Table, TableColumnOptions } from 'typeorm';

/** Database types. */
export const TYPE = {
  NUMBER: {
    INT: 'integer',
    BIGINT: 'bigint',
  },
  STRING: {
    VARCHAR: 'varchar',
  },
  DATETIME: 'datetime',
  BOOLEAN: 'boolean',
};

/** Migrations table name. */
export const MIGRATIONS_TABLE = new Table({
  name: '_migrations',
  columns: [
    {
      name: 'id',
      type: TYPE.NUMBER.INT,
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment',
    },
    {
      name: 'timestamp',
      type: TYPE.NUMBER.BIGINT,
    },
    {
      name: 'name',
      type: TYPE.STRING.VARCHAR,
    },
  ],
});

/** Identifier column. */
export const IDENTIFIER_COLUMN: TableColumnOptions = {
  name: 'id',
  type: TYPE.STRING.VARCHAR,
  isPrimary: true,
  isGenerated: true,
  generationStrategy: 'uuid',
};

/** Trackable columns. */
export const TRACKABLE_COLUMNS: TableColumnOptions[] = [
  {
    name: 'createdAt',
    type: TYPE.DATETIME,
    isNullable: false,
    default: 'datetime()',
  },
  {
    name: 'updatedAt',
    type: TYPE.DATETIME,
    isNullable: false,
    default: 'datetime()',
  },
];

/** Soft delete column. */
export const SOFT_DELETE_COLUMN: TableColumnOptions = {
  name: 'deletedAt',
  type: TYPE.DATETIME,
  isNullable: true,
};

/** Role table. */
export const ROLE_TABLE = new Table({
  name: 'role',
  columns: [
    IDENTIFIER_COLUMN,
    {
      name: 'name',
      type: TYPE.STRING.VARCHAR,
      isUnique: true,
    },
    {
      name: 'description',
      type: TYPE.STRING.VARCHAR,
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
      type: TYPE.STRING.VARCHAR,
      isUnique: true,
      isNullable: false,
    },
    {
      name: 'password',
      type: TYPE.STRING.VARCHAR,
      isNullable: false,
    },
    {
      name: 'firstName',
      type: TYPE.STRING.VARCHAR,
      isNullable: false,
    },
    {
      name: 'lastName',
      type: TYPE.STRING.VARCHAR,
      isNullable: true,
    },
    {
      name: 'isActive',
      type: TYPE.BOOLEAN,
      default: true,
      isNullable: false,
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
      name: 'userId',
      type: TYPE.STRING.VARCHAR,
      isPrimary: true,
    },
    {
      name: 'roleId',
      type: TYPE.STRING.VARCHAR,
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
    IDENTIFIER_COLUMN,
    {
      name: 'userId',
      type: TYPE.STRING.VARCHAR,
      isUnique: true,
    },
    {
      name: 'refreshToken',
      type: TYPE.STRING.VARCHAR,
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

/** Survey table. */
export const SURVEY_TABLE = new Table({
  name: 'survey',
  columns: [
    IDENTIFIER_COLUMN,
    {
      name: 'userId',
      type: TYPE.STRING.VARCHAR,
    },
    {
      name: 'rating',
      type: TYPE.NUMBER.INT,
      isNullable: false,
    },
    {
      name: 'feedback',
      type: TYPE.STRING.VARCHAR,
      isNullable: true,
    },
    {
      name: 'isAnonymous',
      type: TYPE.BOOLEAN,
      default: false,
      isNullable: false,
    },
    ...TRACKABLE_COLUMNS,
    SOFT_DELETE_COLUMN,
  ],
});

/** Database tables. */
export const DATABASE_TABLES = [ROLE_TABLE, USER_TABLE, USER_ROLE_TABLE, SESSION_TABLE, SURVEY_TABLE];
