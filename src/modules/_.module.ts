import { Module } from '@nestjs/common';

import { AppController } from './_.controller';
import { AuthModule } from './auth/_.module';
import { ConfigModule } from './config/_.module';
import { DatabaseModule } from './database';
import { UserModule } from './entities/user/_.module';

@Module({
  imports: [ConfigModule, DatabaseModule, UserModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
