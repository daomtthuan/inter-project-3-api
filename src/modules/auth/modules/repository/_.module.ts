import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity, UserEntity } from '~/entities';

/** Auth repository module. */
export const AuthRepositoryModule = TypeOrmModule.forFeature([UserEntity, SessionEntity]);
