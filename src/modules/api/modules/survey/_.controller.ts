import { Get } from '@nestjs/common';

import { ApiController } from '../../_.decorator';

@ApiController('survey')
export class SurveyApiController {
  /**
   * Get survey list.
   *
   * @returns List of surveys.
   */
  @Get('list')
  getList(): object {
    return {};
  }
}
