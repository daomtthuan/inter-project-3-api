import { Module } from '@nestjs/common';

import { UsersService } from './_.service';

/** User module. */
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
