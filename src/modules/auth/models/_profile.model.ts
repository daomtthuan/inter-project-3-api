import { NotImplementedException } from '@nestjs/common';
import { IsArray, IsEnum, IsString, MaxLength } from 'class-validator';

import { ModelBaseWithTrackable, ModelFactory } from '~/common/base/model';
import { RoleEntity, UserEntity } from '~/entities';

/** Profile. */
class Profile extends ModelBaseWithTrackable {
  /** First name. */
  @IsString()
  @MaxLength(255)
  firstName!: string;

  /** Last name. */
  @IsString()
  @MaxLength(255)
  lastName!: string;

  /** Full name. */
  @IsString()
  fullName!: string;

  /** User roles. */
  @IsArray()
  @IsEnum(RoleEntity.ROLES, { each: true })
  roles!: typeof RoleEntity.ROLES;
}

/** ProfileModel. */
export class ProfileModel extends ModelFactory(Profile, {
  map: (data) => {
    if (data instanceof UserEntity) {
      return {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: data.fullName,
        roles: data.roles?.map((role) => role.name),
      };
    }

    throw new NotImplementedException();
  },
}) {}
