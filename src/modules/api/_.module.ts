import { Module } from '@nestjs/common';

import { SurveyApiModule } from './modules/survey';

@Module({
  imports: [SurveyApiModule],
})
export class ApiModule {}
