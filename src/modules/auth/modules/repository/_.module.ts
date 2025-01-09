import { TypeOrmModule } from '@nestjs/typeorm';

import { Session, User } from '~/modules/entities';

/** Auth repository module. */
export const AuthRepositoryModule = TypeOrmModule.forFeature([User, Session]);
