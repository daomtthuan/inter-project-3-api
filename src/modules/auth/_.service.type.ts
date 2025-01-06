/** JWt payload. */
export type JwtPayload = {
  /** Subject claim (User id) */
  sub: string;

  /** Username. */
  username: string;
};

/** JWT token. */
export type JwtToken = {
  /** Access token. */
  accessToken: string;

  /** Refresh token. */
  refreshToken: string;
};
