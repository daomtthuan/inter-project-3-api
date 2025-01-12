import { Module } from '@nestjs/common';

import { SurveyAdminController, UserAdminController } from './controllers';
import { AdminRepositoryModule } from './modules/repository';
import { GuardAdminService, SurveyAdminService, SurveyReportAdminService, UserAdminService } from './services';

/** Admin module. */
@Module({
  imports: [AdminRepositoryModule],
  providers: [GuardAdminService, SurveyAdminService, SurveyReportAdminService, UserAdminService],
  controllers: [SurveyAdminController, UserAdminController],
})
export class AdminModule {}
