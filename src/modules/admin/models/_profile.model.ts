import { NotImplementedException } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

import { ModelFactory } from '~/common/base/model';
import { UserEntity } from '~/entities';
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
  @IsBoolean()
  isActive!: boolean;
}

/** ProfileModel. */
export class ProfileModel extends ModelFactory(Profile, {
  map: (data) => {
    if (data instanceof UserEntity) {
      return ObjectUtils.pickProperties(data, ['firstName', 'lastName', 'isActive']);
    }

    throw new NotImplementedException();
  },
}) {}
