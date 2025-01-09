import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Except } from 'type-fest';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';

import { Session, User } from '~/modules/entities';
import { RequestTypeWithUser } from '~/types/http';
import { EnvUtils, ObjectUtils, ValueUtils } from '~/utils/core';
import { PasswordUtils, SecureStringUtils } from '~/utils/secure';

import { PayloadModel, TokenModel } from '../models';

/** TokenAuth service. */
@Injectable()
export class TokenAuthService {
  /** Logger. */
  private logger = new Logger(TokenAuthService.name);

  constructor(
    /** JWT service. */
    private jwtService: JwtService,

    /** User repository. */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /** Session repository. */
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  /**
   * Validate JWT payload.
   *
   * @param req Request.
   * @param payloadDto JWT payload.
   *
   * @returns `User` if valid, otherwise `null`.
   */
  async validateJwtPayload(req: RequestTypeWithUser, payloadDto: unknown): Promise<User | null> {
    const payloadModel = await ObjectUtils.createInstance(PayloadModel, payloadDto);
    if (!payloadModel) {
      this.logger.debug('Invalid payload');
      return null;
    }

    const userWhere: FindOptionsWhere<User> = {
      id: payloadModel.sub,
      username: payloadModel.username,
      isActive: true,
    };
    const userRelations: FindOptionsRelations<User> = {
      roles: true,
    };

    // Access token
    if (payloadModel.type === 'access') {
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
    if (payloadModel.type === 'refresh') {
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
    const payload: Except<PayloadModel, 'type'> = {
      sub: user.id,
      username: user.username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        type: 'access',
        ...payload,
      } satisfies PayloadModel),
      this.jwtService.signAsync(
        {
          type: 'refresh',
          ...payload,
        } satisfies PayloadModel,
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
