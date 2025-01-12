import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { EntityBase } from '~/common/base/entity';

import { SurveyReportEntity } from './_reported-survey.entity';
import { UserEntity } from './_user.entity';

/** SurveyReporter. */
export type SurveyReporter = {
  /** Reported by. */
  by: string;

  /** Reason. */
  reason: string;
};

/** SurveyEntity. */
@Entity({
  name: 'survey',
})
export class SurveyEntity extends EntityBase {
  /** Owner ID. */
  @Column({
    name: 'user_id',
    type: 'varchar',
    nullable: false,
  })
  ownerId!: string;

  /** Rating. */
  @Column({
    name: 'rating',
    type: 'integer',
    nullable: false,
  })
  rating!: number;

  /** Feedback. */
  @Column({
    name: 'feedback',
    type: 'varchar',
    nullable: true,
  })
  feedback?: string;

  /** Anonymous. */
  @Column({
    name: 'is_anonymous',
    type: 'boolean',
    nullable: false,
  })
  isAnonymous!: boolean;

  /** Survey owner. */
  @ManyToOne(() => UserEntity, (user) => user.surveys, {
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  owner!: UserEntity;

  /** Session of the user. */
  @OneToOne(() => SurveyReportEntity, (report) => report.survey, {
    nullable: true,
  })
  report?: SurveyReportEntity;

  /**
   * Get reporter.
   *
   * @returns Reporter if reported, otherwise `null`.
   */
  getReporter(): SurveyReporter | null {
    if (this.report?.reporter) {
      return {
        by: this.report.reporter.getFullName(),
        reason: this.report.reason,
      };
    }

    return null;
  }
}
