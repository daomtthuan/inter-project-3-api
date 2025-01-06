/** Root environment keys. */
export type EnvironmentEnvKey = 'NODE_ENV' | 'PORT';

/** App environment keys. */
export type AppEnvKey = 'BASE_URL' | 'SECRET_KEY';

/** Auth environment keys. */
export type AuthEnvKey = 'JWT_SECRET' | 'JWT_ACCESS_TOKEN_EXPIRED' | 'JWT_REFRESH_TOKEN_EXPIRED';

/** Database environment keys. */
export type DatabaseEnvKey = 'DATABASE_DATA_DIR' | 'DATABASE_NAME';

/** Environment keys. */
export type EnvKey = EnvironmentEnvKey | AppEnvKey | AuthEnvKey | DatabaseEnvKey;
