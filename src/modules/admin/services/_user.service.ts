import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity, UserEntity } from '~/entities';
import { PasswordUtils } from '~/utils/secure';

import { ProfileModel, UserModel } from '../models';

/** User admin service. */
@Injectable()
export class UserAdminService {
  private logger = new Logger(UserAdminService.name);

  constructor(
    /** Role repository. */
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,

    /** User repository. */
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Get list of users.
   *
   * @param user User.
   *
   * @returns Users.
   */
  async getList(): Promise<UserEntity[]> {
    const users = await this.userRepository.find({
      relations: {
        roles: true,
      },
    });
    this.logger.debug('Users found', { users });

    return users;
  }

  /**
   * Get User.
   *
   * @param userId User id.
   *
   * @returns User if found, otherwise `null`.
   */
  async get(userId: string): Promise<UserEntity | null> {
    const user = await this.getUser(userId);
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }

    return user;
  }

  /**
   * Get existed User by username.
   *
   * @param user User.
   * @param username Username.
   *
   * @returns User if found, otherwise `null`.
   */
  async getByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }

    return user;
  }

  /**
   * Create a new user.
   *
   * @param user User.
   * @param userModel User model.
   *
   * @returns User if created, otherwise `null`.
   */
  async create(userModel: UserModel): Promise<UserEntity | null> {
    const userRole = await this.roleRepository.findOne({
      where: {
        name: 'user',
      },
    });
    if (!userRole) {
      throw new Error('User role not found');
    }

    const createdUser = this.userRepository.create({
      username: userModel.username,
      password: await PasswordUtils.hash(userModel.password),
      firstName: userModel.firstName,
      lastName: userModel.lastName,
      isActive: true,
      roles: [userRole],
    });

    await createdUser.save();
    this.logger.debug('User created', { user: createdUser });

    return createdUser;
  }

  /**
   * Update user.
   *
   * @param userId User id.
   * @param userModel User model.
   *
   * @returns Updated User.
   */
  async update(userId: string, profileModel: ProfileModel): Promise<UserEntity | null> {
    const user = await this.getUser(userId);
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }

    user.firstName = profileModel.firstName;
    user.lastName = profileModel.lastName;
    user.isActive = profileModel.isActive;

    await user.save();
    this.logger.debug('User updated', { user });

    return user;
  }

  /**
   * Delete user.
   *
   * @param userId User id.
   *
   * @returns User if deleted, otherwise `null`.
   */
  async delete(userId: string): Promise<UserEntity | null> {
    const user = await this.getUser(userId);
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }

    const removedUser = await this.userRepository.softRemove(user);
    this.logger.debug('User deleted', { user: removedUser });

    return removedUser;
  }

  /**
   * Get existed User.
   *
   * @param user User.
   * @param userId User id.
   *
   * @returns User if found, otherwise `null`.
   */
  private async getUser(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        roles: true,
      },
    });
  }
}
