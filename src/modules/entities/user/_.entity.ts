import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '../_base.entity';
import { Role } from '../role/_.entity';

@Entity()
export class User extends BaseEntity {
  /** ID of the user. */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Username of the user. */
  @Column({ unique: true })
  username!: string;

  /** Password of the user. */
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

  @ManyToMany(() => Role)
  @JoinTable()
  roles!: Role[];

  /** @returns Full name of the user. */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
