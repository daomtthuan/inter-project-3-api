import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session, User } from '../entities';
import { AuthService } from './_.service';
import * as controllers from './controllers';
import { JwtAuthModule } from './modules/jwt';
import { AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy } from './strategies';

/** Auth module. */
@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), PassportModule, JwtAuthModule],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: Object.values(controllers),
})
export class AuthModule {}
