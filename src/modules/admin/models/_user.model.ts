import { NotImplementedException } from '@nestjs/common';
import { IsOptional, IsString, Length } from 'class-validator';

import { ModelBase, ModelFactory } from '~/common/base/model';
import { RoleName, UserEntity } from '~/entities';
import { ObjectUtils } from '~/utils/core';

/** User. */
class User extends ModelBase {
  /** Username of the account. */
  @IsString()
  @Length(1, 255)
  username!: string;

  /** Password of the account. */
  @IsString()
  @Length(1, 255)
  password!: string;

  /** First name of the user. */
  @IsString()
  @Length(1, 255)
  firstName!: string;

  /** Last name of the user. */
  @IsString()
  @IsOptional()
  @Length(1, 255)
  lastName?: string;

  /** Is the user active? */
  isActive!: boolean;

  /** Full name of the user. */
  fullName!: string;

  /** Roles of the user. */
  roles!: RoleName[];
}

/** UserModel. */
export class UserModel extends ModelFactory(User, {
  map: (data) => {
    if (data instanceof UserEntity) {
      return {
        ...ObjectUtils.pickProperties(data, ['id', 'username', 'password', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt', 'deletedAt']),
        fullName: data.getFullName(),
        roles: data.roles?.map((role) => role.name),
      };
    }

    throw new NotImplementedException();
  },
}) {}
