import { IsNotEmpty, IsString } from 'class-validator';

/** Interface for TokenModel. */
export interface ITokenModel {
  /** Access token. */
  accessToken: string;

  /** Refresh token. */
  refreshToken: string;
}

/** TokenModel. */
export class TokenModel implements ITokenModel {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
