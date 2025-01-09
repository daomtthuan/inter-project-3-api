import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session, User } from '../entities';
import * as controllers from './controllers';
import { JwtAuthModule } from './modules/jwt';
import { TokenAuthService, UserAuthService } from './services';
import { AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy } from './strategies';

/** Auth module. */
@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), PassportModule, JwtAuthModule],
  providers: [TokenAuthService, UserAuthService, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: Object.values(controllers),
})
export class AuthModule {}
