import { Module } from '@nestjs/common';

import { SurveyApiController } from './controllers';
import { ApiRepositoryModule } from './modules/repository';
import { ApiService, SurveyApiService } from './services';

/** Api module. */
@Module({
  imports: [ApiRepositoryModule],
  providers: [ApiService, SurveyApiService],
  controllers: [SurveyApiController],
})
export class ApiModule {}
