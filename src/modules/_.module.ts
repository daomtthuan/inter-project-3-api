import { Module } from '@nestjs/common';

import { AppController } from './_.controller';
import { AuthModule } from './auth/_.module';
import { ConfigModule } from './config/_.module';
import { DatabaseModule } from './database';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
