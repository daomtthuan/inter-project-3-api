import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RequestTypeWithUser } from '~/types/http';
import { EnvUtils } from '~/utils/core';

import { User, UsersService } from '../entities';
import { JwtPayload, JwtToken } from './_.service.type';

/** Auth service. */
@Injectable()
export class AuthService {
  /** Logger. */
  private logger = new Logger(AuthService.name);

  constructor(
    /** JWT service. */
    private jwtService: JwtService,
    /** Users service. */
    private usersService: UsersService,
  ) {}

  /**
   * Validate user.
   *
   * @param username Username.
   * @param password Password.
   *
   * @returns `User` if valid, otherwise `null`.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }

    if (user.password !== password) {
      this.logger.debug('Invalid password');
      return null;
    }

    return user;
  }

  /**
   * Validate JWT payload.
   *
   * @param payload JWT payload.
   *
   * @returns `User` if valid, otherwise `null`.
   */
  async validateJwtPayload(payload: unknown): Promise<User | null> {
    if (
      !payload ||
      typeof payload !== 'object' ||
      !('sub' in payload) ||
      !('username' in payload) ||
      typeof payload['sub'] !== 'string' ||
      typeof payload['username'] !== 'string'
    ) {
      this.logger.debug('Invalid JWT payload');

      return null;
    }

    const user = await this.usersService.findOneByUsername(payload['username']);
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }

    if (user.id.toString() !== payload['sub']) {
      this.logger.debug('Mismatch user id');
      return null;
    }

    return user;
  }

  /**
   * Sign in a user.
   *
   * @param req Request.
   *
   * @returns JWT token if successful, otherwise `null`.
   */
  async createToken({ user }: RequestTypeWithUser): Promise<JwtToken | null> {
    if (!user) {
      this.logger.debug(`'user' not found in request`);

      return null;
    }

    const tokenPayload: JwtPayload = {
      sub: user.id.toString(),
      username: user.username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload),
      this.jwtService.signAsync(tokenPayload, {
        expiresIn: EnvUtils.getString('JWT_REFRESH_TOKEN_EXPIRED'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
