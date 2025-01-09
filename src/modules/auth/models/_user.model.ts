/** Interface for UserModel. */
export interface IUserModel {
  /** Username. */
  username: string;

  /** Password. */
  password: string;
}

/** UserModel. */
export class UserModel implements IUserModel {
  username: string;
  password: string;

  constructor({ username, password }: IUserModel) {
    this.username = username;
    this.password = password;
  }
}
