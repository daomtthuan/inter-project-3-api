import { TypeOrmModule } from '@nestjs/typeorm';

import { SurveyEntity, SurveyReportEntity } from '~/entities';

/** Admin repository module. */
export const AdminRepositoryModule = TypeOrmModule.forFeature([SurveyEntity, SurveyReportEntity]);
