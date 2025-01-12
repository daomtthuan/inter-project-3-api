import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { EntityBase } from '~/common/base/entity';

import { UserEntity } from './_user.entity';

/** SurveyEntity. */
@Entity({ name: 'survey' })
export class SurveyEntity extends EntityBase {
  /** User ID. */
  @Column()
  userId!: string;

  /** Rating. */
  @Column()
  rating!: number;

  /** Feedback. */
  @Column()
  feedback?: string;

  /** Anonymous. */
  @Column()
  isAnonymous!: boolean;

  /** Survey owner. */
  @ManyToOne(() => UserEntity, (user) => user.surveys)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;
}
