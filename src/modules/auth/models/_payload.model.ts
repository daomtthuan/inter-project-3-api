import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

/** Interface for PayloadModel. */
export interface IPayloadModel {
  /** Type of token. */
  type: 'access' | 'refresh';

  /** Subject claim (User id) */
  sub: string;

  /** Username. */
  username: string;
}

/** PayloadModel. */
export class PayloadModel implements IPayloadModel {
  @IsEnum(['access', 'refresh'])
  type!: 'access' | 'refresh';

  @IsString()
  @IsNotEmpty()
  sub!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;
}
