import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';

import { RequestTypeWithUser } from '~/types/http';
import { EnvUtils, ValueUtils } from '~/utils/core';
import { PasswordUtils, SecureStringUtils } from '~/utils/secure';

import { Session, User } from '../entities';
import { PayloadModel, TokenModel, UserModel } from './models';

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
   * @param userModel UserModel.
   *
   * @returns `User` if valid, otherwise `null`.
   */
  async validateUser({ username, password }: UserModel): Promise<User | null> {
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
   * @param req Request.
   * @param payload JWT payload.
   *
   * @returns `User` if valid, otherwise `null`.
   */
  async validateJwtPayload(req: RequestTypeWithUser, payload: PayloadModel): Promise<User | null> {
    const userWhere: FindOptionsWhere<User> = {
      id: payload['sub'],
      username: payload['username'],
      isActive: true,
    };
    const userRelations: FindOptionsRelations<User> = {
      roles: true,
    };

    // Access token
    if (payload.type === 'access') {
      const user = await this.userRepository.findOne({
        where: userWhere,
        relations: userRelations,
      });
      if (!user) {
        this.logger.debug('User not found');
        return null;
      }

      return user;
    }

    // Refresh token
    if (payload.type === 'refresh') {
      const token = this.extractToken(req);
      if (!token) {
        this.logger.debug('Token not found');
        return null;
      }

      const session = await this.sessionRepository.findOne({
        where: {
          user: userWhere,
        },
        relations: {
          user: userRelations,
        },
      });
      if (!session) {
        this.logger.debug('Session not found');
        return null;
      }

      if (!(await PasswordUtils.verify(token, session.refreshToken))) {
        this.logger.debug('Invalid token');
        return null;
      }

      return session.user;
    }

    return null;
  }

  /**
   * Sign in a user.
   *
   * @param req Request.
   *
   * @returns JWT token if successful, otherwise `null`.
   */
  async createToken({ user }: RequestTypeWithUser): Promise<TokenModel | null> {
    if (!user) {
      this.logger.debug(`'user' not found in request`);
      return null;
    }

    const existedSession = await this.sessionRepository.findOne({
      where: {
        user,
      },
    });
    if (existedSession) {
      this.logger.debug('Session found -> remove');
      await existedSession.remove();
    }

    const token = await this.generateToken(user);
    this.logger.debug('Tokens generated', {
      accessToken: SecureStringUtils.mask(token.accessToken, 4),
      refreshToken: SecureStringUtils.mask(token.refreshToken, 4),
    });

    const session = this.sessionRepository.create({
      user,
      refreshToken: await PasswordUtils.hash(token.refreshToken),
    });
    await session.save();

    return token;
  }

  /**
   * Generate JWT token.
   *
   * @param user User.
   *
   * @returns JWT token.
   */
  private async generateToken(user: User): Promise<TokenModel> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        new PayloadModel({
          type: 'access',
          sub: user.id,
          username: user.username,
        }).toJSON(),
      ),
      this.jwtService.signAsync(
        new PayloadModel({
          type: 'refresh',
          sub: user.id,
          username: user.username,
        }).toJSON(),
        {
          secret: EnvUtils.getString('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: EnvUtils.getString('JWT_REFRESH_TOKEN_EXPIRED'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Extract token from authorization header.
   *
   * @param request Request.
   *
   * @returns Token.
   */
  private extractToken({ headers }: RequestTypeWithUser): string | null {
    const authorization = headers?.authorization;
    if (!ValueUtils.isString(authorization) || ValueUtils.isEmpty(authorization)) {
      return null;
    }

    const [type, token = null] = authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
