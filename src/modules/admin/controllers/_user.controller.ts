import { Body, ConflictException, Delete, Get, NotFoundException, Param, Patch, Post, UnprocessableEntityException } from '@nestjs/common';

import { AdminController } from '../_.decorator';
import { ProfileModel, UserModel } from '../models';
import { UserAdminService } from '../services/_user.service';

/** User admin controller. */
@AdminController('user')
export class UserAdminController {
  constructor(
    /** User report admin service. */
    private userAdminService: UserAdminService,
  ) {}

  /**
   * Get user list.
   *
   * @returns List of users.
   */
  @Get('list')
  async list(): Promise<UserModel[]> {
    const users = await this.userAdminService.getList();

    return users.map((user) =>
      UserModel.create(user, {
        omit: ['password', 'firstName', 'lastName'],
      }),
    );
  }

  /**
   * Get user.
   *
   * @param userId User id.
   *
   * @returns User.
   */
  @Get(':id')
  async get(@Param('id') userId: string): Promise<UserModel> {
    const user = await this.userAdminService.get(userId);
    if (!user) {
      throw new NotFoundException();
    }

    return UserModel.create(user, {
      omit: ['password', 'fullName'],
    });
  }

  /**
   * Create user.
   *
   * @param userModel User model.
   *
   * @returns Created User.
   */
  @Post()
  async create(@Body() userModel: UserModel): Promise<UserModel> {
    const existedUser = await this.userAdminService.getByUsername(userModel.username);
    if (existedUser) {
      throw new ConflictException('Username already exists');
    }

    const user = await this.userAdminService.create(userModel);
    if (!user) {
      throw new UnprocessableEntityException('User role not found');
    }

    return UserModel.create(user, {
      pick: ['id', 'createdAt'],
    });
  }

  /**
   * Update user.
   *
   * @param userId User id.
   * @param profileModel Profile model.
   *
   * @returns Updated User.
   */
  @Patch(':id')
  async update(@Param('id') userId: string, @Body() profileModel: ProfileModel): Promise<UserModel> {
    const user = await this.userAdminService.update(userId, profileModel);
    if (!user) {
      throw new NotFoundException();
    }

    return UserModel.create(user, {
      pick: ['id', 'updatedAt'],
    });
  }

  /**
   * Delete user.
   *
   * @param userId User id.
   *
   * @returns Deleted user.
   */
  @Delete(':id')
  async delete(@Param('id') userId: string): Promise<UserModel> {
    const user = await this.userAdminService.delete(userId);
    if (!user) {
      throw new NotFoundException();
    }

    return UserModel.create(user, {
      pick: ['id', 'deletedAt'],
    });
  }
}
