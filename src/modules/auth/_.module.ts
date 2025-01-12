import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ProfileAuthController, TokenAuthController } from './controllers';
import { JwtAuthModule } from './modules/jwt';
import { AuthRepositoryModule } from './modules/repository';
import { TokenAuthService, UserAuthService } from './services';
import { AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy } from './strategies';

/** Auth module. */
@Module({
  imports: [AuthRepositoryModule, PassportModule, JwtAuthModule],
  providers: [TokenAuthService, UserAuthService, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [TokenAuthController, ProfileAuthController],
})
export class AuthModule {}
