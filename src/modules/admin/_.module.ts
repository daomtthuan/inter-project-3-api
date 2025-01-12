import { Module } from '@nestjs/common';

import { SurveyAdminController } from './controllers';
import { AdminRepositoryModule } from './modules/repository';
import { GuardAdminService, SurveyAdminService, SurveyReportAdminService } from './services';

/** Admin module. */
@Module({
  imports: [AdminRepositoryModule],
  providers: [GuardAdminService, SurveyAdminService, SurveyReportAdminService],
  controllers: [SurveyAdminController],
})
export class AdminModule {}
