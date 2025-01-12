import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

import { EntityBase } from '~/common/base/entity';

import { RoleEntity } from './_role.entity';
import { SessionEntity } from './_session.entity';
import { SurveyEntity } from './_survey.entity';

/** UserEntity. */
@Entity({ name: 'user' })
export class UserEntity extends EntityBase {
  /** Username of the account. */
  @Column({ unique: true })
  username!: string;

  /** Password of the account. */
  @Column()
  password!: string;

  /** First name of the user. */
  @Column()
  firstName!: string;

  /** Last name of the user. */
  @Column({ nullable: true })
  lastName?: string;

  /** Is the user active? */
  @Column({ default: true })
  isActive!: boolean;

  /** Roles of the user. */
  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({ name: 'user_role' })
  roles?: RoleEntity[];

  /** Session of the user. */
  @OneToOne(() => SessionEntity, (session) => session.user)
  session?: SessionEntity;

  /** Surveys of the user. */
  @OneToMany(() => SurveyEntity, (survey) => survey.user)
  surveys?: SurveyEntity[];

  /** @returns Full name of the user. */
  get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.replace(/\s+/g, ' ').trim();
  }
}
