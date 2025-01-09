import { Exclude, Expose, Transform } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { Role } from './_role.entity';
import { Session } from './_session.entity';

@Entity()
export class User extends BaseEntity {
  /** ID of the user. */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Username of the account. */
  @Column({ unique: true })
  username!: string;

  /** Password of the account. */
  @Exclude()
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
  @Transform(({ value }) => value.map((role: Role) => role.name))
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_role' })
  roles?: Role[];

  /** Session of the user. */
  @Exclude()
  @OneToOne(() => Session, (session) => session.user)
  session?: Session;

  /** @returns Full name of the user. */
  @Expose()
  get fullName(): string {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.replace(/\s+/g, ' ').trim();
  }
}
