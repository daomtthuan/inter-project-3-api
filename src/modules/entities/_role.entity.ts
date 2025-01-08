import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { User } from './_user.entity';

@Entity()
export class Role extends BaseEntity {
  /** ID of the role. */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Name of the role. */
  @Column({ unique: true })
  name!: string;

  /** Description of the role. */
  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: 'user_roles',
  })
  users!: User[];
}
