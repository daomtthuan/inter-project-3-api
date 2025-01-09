import { IsNotEmpty, IsString } from 'class-validator';

/** Interface for UserModel. */
export interface IUserModel {
  /** Username. */
  username: string;

  /** Password. */
  password: string;
}

/** UserModel. */
export class UserModel implements IUserModel {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
