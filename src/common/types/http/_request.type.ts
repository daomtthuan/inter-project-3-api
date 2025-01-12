import { UserEntity } from '~/entities';

/**
 * Request.
 *
 * @template TUser User type.
 * @template TAuthInfo Authentication information type.
 */
export type Request<TUser = undefined, TAuthInfo = undefined> = Express.Request & {
  /** User. */
  user: TUser;

  /** Authentication information. */
  authInfo: TAuthInfo;

  /** Request headers. */
  headers?: Record<string, unknown> | undefined;
};

/**
 * Request with user.
 *
 * @template TAuthInfo Authentication information type.
 */
export type RequestWithUser = Request<UserEntity, Record<string, unknown>>;
