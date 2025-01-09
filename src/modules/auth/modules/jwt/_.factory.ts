import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

import { EnvUtils } from '~/utils/core';
import { SecureStringUtils } from '~/utils/secure';

import { JwtAuthModule } from './_.module';

/** JwtAuth factory. */
export const JwtAuthFactory = registerAs('JWT_AUTH', (): JwtModuleOptions => {
  const logger = new Logger(JwtAuthModule.module.name);

  const issuer = EnvUtils.getString('BASE_URL');
  const secret = EnvUtils.getString('JWT_ACCESS_TOKEN_SECRET');
  const expiresIn = EnvUtils.getString('JWT_ACCESS_TOKEN_EXPIRED');

  logger.debug(`${JwtAuthFactory.KEY} loaded`, {
    issuer,
    accessToken: {
      secret: SecureStringUtils.mask(secret, 4),
      expiresIn,
    },
    refreshToken: {
      secret: SecureStringUtils.mask(EnvUtils.getString('JWT_REFRESH_TOKEN_SECRET'), 4),
      expiresIn: EnvUtils.getString('JWT_REFRESH_TOKEN_EXPIRED'),
    },
  });

  return {
    secret,
    signOptions: {
      issuer,
      expiresIn,
    },
    verifyOptions: {
      issuer,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    },
  };
});
