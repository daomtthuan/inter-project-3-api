import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { EntityBaseWithTrackable } from '~/common/base/entity';

import { SurveyEntity } from './_survey.entity';
import { UserEntity } from './_user.entity';

/** SurveyReportEntity. */
@Entity({
  name: 'survey_report',
})
export class SurveyReportEntity extends EntityBaseWithTrackable {
  /** Survey ID. */
  @Column({
    name: 'survey_id',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  surveyId!: string;

  /** Reporter ID. */
  @Column({
    name: 'user_id',
    type: 'varchar',
    nullable: false,
  })
  reporterId!: string;

  /** Rating. */
  @Column({
    name: 'reason',
    type: 'varchar',
    nullable: true,
  })
  reason!: string;

  /** User. */
  @OneToOne(() => SurveyEntity, (user) => user.report, {
    nullable: false,
  })
  @JoinColumn({
    name: 'survey_id',
    referencedColumnName: 'id',
  })
  survey!: SurveyEntity;

  /** Survey reporter. */
  @ManyToOne(() => UserEntity, (user) => user.surveyReports, {
    nullable: false,
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  reporter!: UserEntity;
}
