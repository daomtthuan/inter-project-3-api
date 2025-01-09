import { Module } from '@nestjs/common';

import { SurveyApiController } from './_.controller';

@Module({
  controllers: [SurveyApiController],
})
export class SurveyApiModule {}
