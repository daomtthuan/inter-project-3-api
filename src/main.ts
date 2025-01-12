import { ClassSerializerInterceptor, INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import Helmet from 'helmet';

import { AppModule } from './modules';
import { EnvUtils } from './utils/core';

(async function main() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  useMiddlewares(app);
  useGuards(app);
  useInterceptors(app);
  usePipes(app);

  await app.listen(EnvUtils.getNumber('PORT'));
  logger.log(`Application is running on: ${EnvUtils.getString('BASE_URL')}`);
})();

/**
 * Use Middlewares.
 *
 * @param app Application.
 */
function useMiddlewares(app: INestApplication) {
  app.enableCors();
  app.use(Helmet());
}

/**
 * Use Guards.
 *
 * @param app Application.
 */
function useGuards(_app: INestApplication) {}

/**
 * Use Interceptors.
 *
 * @param app Application.
 */
function useInterceptors(app: INestApplication) {
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
}

/**
 * Use Pipes.
 *
 * @param app Application.
 */
function usePipes(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
}
