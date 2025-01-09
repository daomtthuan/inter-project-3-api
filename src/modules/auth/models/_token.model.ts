/** Interface for TokenModel. */
export interface ITokenModel {
  /** Access token. */
  accessToken: string;

  /** Refresh token. */
  refreshToken: string;
}

/** TokenModel. */
export class TokenModel implements ITokenModel {
  accessToken: string;
  refreshToken: string;

  constructor({ accessToken, refreshToken }: ITokenModel) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
