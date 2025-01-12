import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

import { EntityBase } from '~/common/base/entity';

import { SurveyReportEntity } from './_reported-survey.entity';
import { RoleEntity } from './_role.entity';
import { SessionEntity } from './_session.entity';
import { SurveyEntity } from './_survey.entity';

/** UserEntity. */
@Entity({
  name: 'user',
})
export class UserEntity extends EntityBase {
  /** Username of the account. */
  @Column({
    name: 'username',
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  username!: string;

  /** Password of the account. */
  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
  })
  password!: string;

  /** First name of the user. */
  @Column({
    name: 'first_name',
    type: 'varchar',
    nullable: false,
  })
  firstName!: string;

  /** Last name of the user. */
  @Column({
    name: 'last_name',
    type: 'varchar',
    nullable: true,
  })
  lastName?: string;

  /** Is the user active? */
  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive!: boolean;

  /** Roles of the user. */
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles?: RoleEntity[];

  /** Session of the user. */
  @OneToOne(() => SessionEntity, (session) => session.user, {
    nullable: true,
  })
  session?: SessionEntity;

  /** Surveys of the user. */
  @OneToMany(() => SurveyEntity, (survey) => survey.owner, {
    nullable: true,
  })
  surveys?: SurveyEntity[];

  /** Survey reports of the user. */
  @OneToMany(() => SurveyReportEntity, (survey) => survey.reporter, {
    nullable: true,
  })
  surveyReports?: SurveyReportEntity[];

  /**
   * Get full name of the user.
   *
   * @returns Full name of the user.
   */
  getFullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.replace(/\s+/g, ' ').trim();
  }
}
