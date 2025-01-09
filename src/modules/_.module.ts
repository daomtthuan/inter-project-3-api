import { Module } from '@nestjs/common';

import { AppController } from './_.controller';
import { ApiModule } from './api';
import { AuthModule } from './auth';
import { ConfigModule } from './config';
import { DatabaseModule } from './database';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule, ApiModule],
  controllers: [AppController],
})
export class AppModule {}
