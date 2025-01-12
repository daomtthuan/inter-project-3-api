import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { EntityBaseWithTrackable } from '~/common/base/entity';

import { UserEntity } from './_user.entity';

/** SessionEntity. */
@Entity({ name: 'session' })
export class SessionEntity extends EntityBaseWithTrackable {
  /** User ID. */
  @Column({ unique: true })
  userId!: string;

  /** Refresh token. */
  @Column()
  refreshToken!: string;

  /** User. */
  @OneToOne(() => UserEntity, (user) => user.session)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
