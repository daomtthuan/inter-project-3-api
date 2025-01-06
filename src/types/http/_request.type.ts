import { User } from '~/modules/entities';

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
};

/**
 * Request type with user.
 *
 * @template TAuthInfo Authentication information type.
 */
export type RequestTypeWithUser<TAuthInfo = undefined> = RequestType<User, TAuthInfo>;
