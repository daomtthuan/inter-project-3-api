import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import Helmet from 'helmet';

import { AppModule } from './modules';
import { EnvUtils } from './utils/core';

(async function main() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(Helmet());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(EnvUtils.getNumber('PORT'));
  logger.log(`Application is running on: ${EnvUtils.getString('BASE_URL')}`);
})();
