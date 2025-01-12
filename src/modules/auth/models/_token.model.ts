import { IsNotEmpty, IsString } from 'class-validator';

import { ModelFactory } from '~/common/base/model';

/** Token. */
class Token {
  /** Access token. */
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  /** Refresh token. */
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

/** TokenModel. */
export class TokenModel extends ModelFactory(Token) {}
