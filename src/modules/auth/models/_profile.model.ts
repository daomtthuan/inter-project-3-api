import { NotImplementedException } from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { ModelFactory } from '~/common/base/model';
import { RoleName, UserEntity } from '~/entities';
import { ObjectUtils } from '~/utils/core';

/** Profile. */
class Profile {
  /** First name. */
  @IsString()
  @MaxLength(255)
  firstName!: string;

  /** Last name. */
  @IsString()
  @IsOptional()
  @MaxLength(255)
  lastName?: string;

  /** Full name. */
  fullName!: string;

  /** User roles. */
  roles!: RoleName[];
}

/** ProfileModel. */
export class ProfileModel extends ModelFactory(Profile, {
  map: (data) => {
    if (data instanceof UserEntity) {
      return {
        ...ObjectUtils.pickProperties(data, ['firstName', 'lastName']),
        fullName: data.getFullName(),
        roles: data.roles?.map((role) => role.name),
      };
    }

    throw new NotImplementedException();
  },
}) {}
