import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { User } from './_user.entity';

/** Session entity. */
@Entity()
export class Session extends BaseEntity {
  /** User ID. */
  @PrimaryColumn()
  userId!: string;

  /** Refresh token. */
  @PrimaryColumn()
  refreshToken!: string;

  /** User. */
  @ManyToOne(() => User, (user) => user.sessions)
  user!: User;
}
