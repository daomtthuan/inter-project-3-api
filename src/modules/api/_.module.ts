import { Module } from '@nestjs/common';

import { SurveyApiController } from './controllers';
import { ApiRepositoryModule } from './modules/repository';
import { GuardApiService, SurveyApiService } from './services';

/** Api module. */
@Module({
  imports: [ApiRepositoryModule],
  providers: [GuardApiService, SurveyApiService],
  controllers: [SurveyApiController],
})
export class ApiModule {}
