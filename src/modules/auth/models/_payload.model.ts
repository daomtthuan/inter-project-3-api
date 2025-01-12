import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ModelFactory } from '~/common/base/model';

/** Payload. */
class Payload {
  /** Type of token. */
  @IsEnum(['access', 'refresh'])
  type!: 'access' | 'refresh';

  /** Subject claim (User id) */
  @IsString()
  @IsNotEmpty()
  sub!: string;

  /** Username. */
  @IsString()
  @IsNotEmpty()
  username!: string;
}

/** PayloadModel. */
export class PayloadModel extends ModelFactory(Payload) {}
