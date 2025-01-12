import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { EntityBaseWithTrackable } from '~/common/base/entity';

import { UserEntity } from './_user.entity';

/** SessionEntity. */
@Entity({
  name: 'session',
})
export class SessionEntity extends EntityBaseWithTrackable {
  /** User ID. */
  @Column({
    name: 'user_id',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  userId!: string;

  /** Refresh token. */
  @Column({
    name: 'refresh_token',
    type: 'varchar',
    nullable: false,
  })
  refreshToken!: string;

  /** User. */
  @OneToOne(() => UserEntity, (user) => user.session, {
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user!: UserEntity;
}
