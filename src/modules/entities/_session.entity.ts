import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { User } from './_user.entity';

/** Session entity. */
@Entity()
export class Session extends BaseEntity {
  /** User ID. */
  @PrimaryColumn()
  userId!: string;

  /** Refresh token. */
  @Column()
  refreshToken!: string;

  /** User. */
  @OneToOne(() => User, (user) => user.session)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
