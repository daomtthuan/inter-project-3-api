import { ConfigModule as BaseConfigModule } from '@nestjs/config';

/** Config module. */
export const ConfigModule = BaseConfigModule.forRoot({
  isGlobal: true,
  cache: true,
});
