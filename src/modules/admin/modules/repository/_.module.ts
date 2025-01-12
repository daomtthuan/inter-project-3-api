import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity, SurveyEntity, SurveyReportEntity, UserEntity } from '~/entities';

/** Admin repository module. */
export const AdminRepositoryModule = TypeOrmModule.forFeature([UserEntity, RoleEntity, SurveyEntity, SurveyReportEntity]);
