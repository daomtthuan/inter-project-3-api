import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestTypeWithUser } from '~/types/http';
import { EnvUtils } from '~/utils/core';
import { PasswordUtils, SecureStringUtils } from '~/utils/secure';

import { Session, User } from '../entities';
import { JwtPayload, JwtToken } from './_.service.type';

/** Auth service. */
@Injectable()
export class AuthService {
  /** Logger. */
  private logger = new Logger(AuthService.name);

  constructor(
    /** JWT service. */
    private jwtService: JwtService,

    /** User repository. */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
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
    const user = await this.userRepository.findOne({
      where: {
        username,
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

    if (!(await PasswordUtils.verify(password, user.password))) {
      this.logger.debug('Invalid password');
      return null;
    }

    return user;
  }

  /**
   * Validate JWT payload.
   *
   * @param payload JWT payload.
   * @param isRefreshToken Is refresh token.
   *
   * @returns `User` if valid, otherwise `null`.
   */
  async validateJwtPayload(payload: unknown, isRefreshToken: boolean = false): Promise<User | null> {
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

    // Access token
    if (!isRefreshToken) {
      if ('token' in payload) {
        this.logger.debug('Invalid AccessToken JWT payload');
        return null;
      }

      const user = await this.userRepository.findOne({
        where: {
          id: payload['sub'],
          username: payload['username'],
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

      return user;
    }

    // Refresh token
    else {
      if (!('token' in payload) || typeof payload['token'] !== 'string') {
        this.logger.debug('Invalid RefreshToken JWT payload');
        return null;
      }

      const session = await this.sessionRepository.findOne({
        where: {
          user: {
            id: payload['sub'],
            username: payload['username'],
            isActive: true,
          },
        },

        relations: {
          user: {
            roles: true,
          },
        },
      });
      if (!session) {
        this.logger.debug('Session not found');
        return null;
      }

      const token = SecureStringUtils.decrypt(payload['token']);
      if (!(await PasswordUtils.verify(session.refreshToken, token))) {
        this.logger.debug('Invalid RefreshToken');
        return null;
      }

      return session.user;
    }
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

    return this.generateToken(user);
  }

  /**
   * Generate JWT token.
   *
   * @param user User.
   *
   * @returns JWT token.
   */
  private async generateToken(user: User): Promise<JwtToken> {
    const existedSession = await this.sessionRepository.findOne({
      where: {
        user,
      },
    });
    if (existedSession) {
      this.logger.debug('Session found -> remove');
      await existedSession.remove();
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const token = await PasswordUtils.generateSalt();
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(
        {
          ...payload,
          token: SecureStringUtils.encrypt(await PasswordUtils.hash(token)),
        },
        {
          expiresIn: EnvUtils.getString('JWT_REFRESH_TOKEN_EXPIRED'),
        },
      ),
    ]);
    this.logger.debug('Tokens generated', {
      accessToken: SecureStringUtils.mask(accessToken, 4),
      refreshToken: SecureStringUtils.mask(refreshToken, 4),
    });

    const session = this.sessionRepository.create({
      user,
      refreshToken: token,
    });
    await session.save();

    return {
      accessToken,
      refreshToken,
    };
  }
}
