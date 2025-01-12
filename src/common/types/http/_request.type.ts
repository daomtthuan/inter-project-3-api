import { UserEntity } from '~/entities';

/**
 * Request type.
 *
 * @template TUser User type.
 * @template TAuthInfo Authentication information type.
 */
export type RequestType<TUser = undefined, TAuthInfo = undefined> = Express.Request & {
  /** User. */
  user: TUser;

  /** Authentication information. */
  authInfo: TAuthInfo;

  /** Request headers. */
  headers?: Record<string, unknown> | undefined;
};

/**
 * Request type with user.
 *
 * @template TAuthInfo Authentication information type.
 */
export type RequestTypeWithUser = RequestType<UserEntity, Record<string, unknown>>;
