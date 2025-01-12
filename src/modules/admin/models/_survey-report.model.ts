import { NotImplementedException } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

import { ModelBaseWithTrackable, ModelFactory } from '~/common/base/model';
import { SurveyReportEntity } from '~/entities';
import { ObjectUtils } from '~/utils/core';

/** SurveyReport. */
class SurveyReport extends ModelBaseWithTrackable {
  /** Survey id. */
  surveyId!: string;

  /** Reason. */
  @IsString()
  @Length(1, 1000)
  reason!: string;
}

/** SurveyReportModel. */
export class SurveyReportModel extends ModelFactory(SurveyReport, {
  map: (data) => {
    if (data instanceof SurveyReportEntity) {
      return ObjectUtils.pickProperties(data, ['id', 'reason', 'surveyId', 'createdAt', 'updatedAt']);
    }

    throw new NotImplementedException();
  },
}) {}
