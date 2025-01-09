import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '~/modules/entities';
import { ObjectUtils } from '~/utils/core';
import { PasswordUtils } from '~/utils/secure';

import { UserModel } from '../models';

/** UserAuth service. */
@Injectable()
export class UserAuthService {
  /** Logger. */
  private logger = new Logger(UserAuthService.name);

  constructor(
    /** User repository. */
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Validate user.
   *
   * @param usernameDto Username.
   * @param passwordDto Password.
   *
   * @returns `User` if valid, otherwise `null`.
   */
  async validateUser(usernameDto: unknown, passwordDto: unknown): Promise<User | null> {
    const userModel = await ObjectUtils.createInstance(UserModel, { username: usernameDto, password: passwordDto });
    if (!userModel) {
      this.logger.debug('Invalid user model');
      return null;
    }

    const user = await this.userRepository.findOne({
      where: {
        username: userModel.username,
        isActive: true,
      },
      relations: {
        roles: true,
      },
    });
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }

    if (!(await PasswordUtils.verify(userModel.password, user.password))) {
      this.logger.debug('Invalid password');
      return null;
    }

    return user;
  }
}
