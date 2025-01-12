import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '~/entities';
import { PasswordUtils } from '~/utils/secure';

import { UserModel } from '../models';

/** UserAuth service. */
@Injectable()
export class UserAuthService {
  /** Logger. */
  private logger = new Logger(UserAuthService.name);

  constructor(
    /** User repository. */
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Validate user.
   *
   * @param username Username.
   * @param password Password.
   *
   * @returns `User` if valid, otherwise `null`.
   */
  async validateUser(username: unknown, password: unknown): Promise<UserEntity | null> {
    const user = await UserModel.validate({
      username,
      password,
    });
    if (!user) {
      this.logger.debug('Invalid user model');
      return null;
    }

    const existedUser = await this.userRepository.findOne({
      where: {
        username: user.username,
        isActive: true,
      },
      relations: {
        roles: true,
      },
    });
    if (!existedUser) {
      this.logger.debug('User not found');
      return null;
    }

    if (!(await PasswordUtils.verify(user.password, existedUser.password))) {
      this.logger.debug('Invalid password');
      return null;
    }

    return existedUser;
  }
}
