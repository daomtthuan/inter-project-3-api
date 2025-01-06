import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../entities';
import { AuthController } from './_.controller';
import { AuthService } from './_.service';
import { JwtAuthModule } from './modules/jwt';
import { LocalStrategy } from './strategies';
import { JwtStrategy } from './strategies/_jwt.strategy';

/** Auth module. */
@Module({
  imports: [UserModule, PassportModule, JwtAuthModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
