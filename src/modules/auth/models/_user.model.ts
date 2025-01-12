import { IsNotEmpty, IsString } from 'class-validator';

import { ModelFactory } from '~/common/base/model';

/** User. */
class User {
  /** Username. */
  @IsString()
  @IsNotEmpty()
  username!: string;

  /** Password. */
  @IsString()
  @IsNotEmpty()
  password!: string;
}

/** UserModel. */
export class UserModel extends ModelFactory(User) {}
