import { NotImplementedException } from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';

import { ModelBase, ModelFactory } from '~/common/base/model';
import { SurveyEntity, SurveyReporter } from '~/entities';
import { ObjectUtils } from '~/utils/core';

/** Survey. */
class Survey extends ModelBase {
  /** Rating. */
  @IsNumber()
  @Min(1)
  @Max(10)
  rating!: number;

  /** Feedback. */
  @IsString()
  @IsOptional()
  @Length(1, 1000)
  feedback?: string;

  /** Anonymous. */
  @IsBoolean()
  isAnonymous!: boolean;

  /** Owner. */
  owner?: string;

  /** Is reported. */
  reported?: boolean | SurveyReporter;
}

/** SurveyModel. */
export class SurveyModel extends ModelFactory(Survey, {
  map: (data) => {
    if (data instanceof SurveyEntity) {
      return {
        ...ObjectUtils.pickProperties(data, ['id', 'rating', 'feedback', 'createdAt', 'updatedAt']),
        owner: data.isAnonymous ? undefined : data.owner.getFullName(),
        reported: (() => {
          if (!data.report) {
            return false;
          }

          return data.getReporter() ?? true;
        })(),
      };
    }

    throw new NotImplementedException();
  },
}) {}
