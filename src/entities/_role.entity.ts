import { Column, Entity, ManyToMany } from 'typeorm';

import { EntityBase } from '~/common/base/entity';
import { Nullable } from '~/common/types/core';

import { UserEntity } from './_user.entity';

/** Role names. */
export type RoleName = 'user' | 'admin';

/** RoleEntity. */
@Entity({
  name: 'role',
})
export class RoleEntity extends EntityBase {
  /** Allowed role names. */
  static readonly ROLES: RoleName[] = ['user', 'admin'];

  /** Name of the role. */
  @Column({
    name: 'name',
    type: 'varchar',
    enum: RoleEntity.ROLES,
    unique: true,
    nullable: false,
  })
  name!: RoleName;

  /** Description of the role. */
  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description?: Nullable<string>;

  /** Users with this role. */
  @ManyToMany(() => UserEntity, (user) => user.roles)
  users?: UserEntity[];
}
