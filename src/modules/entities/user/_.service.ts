import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './_.entity';

/** User service. */
@Injectable()
export class UserService {
  constructor(
    /** Users repository. */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Finds all users.
   *
   * @returns Array of users.
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Finds user by id.
   *
   * @param id User id.
   *
   * @returns User.
   */
  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * Finds user by username.
   *
   * @param username Username.
   *
   * @returns User.
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  /**
   * Removes user by id.
   *
   * @param id User id.
   */
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
