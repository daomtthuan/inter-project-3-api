import { TypeOrmModule } from '@nestjs/typeorm';

import { SurveyEntity } from '~/entities';

/** Api repository module. */
export const ApiRepositoryModule = TypeOrmModule.forFeature([SurveyEntity]);
