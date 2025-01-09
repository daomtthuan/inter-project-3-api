import { instanceToPlain } from 'class-transformer';

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
  type: 'access' | 'refresh';
  sub: string;
  username: string;

  constructor({ type, sub, username }: IPayloadModel) {
    this.type = type;
    this.sub = sub;
    this.username = username;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
