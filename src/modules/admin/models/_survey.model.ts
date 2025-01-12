import { NotImplementedException } from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';

import { ModelBase, ModelFactory } from '~/common/base/model';
import { SurveyEntity } from '~/entities';
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
  reported?:
    | boolean
    | {
        /** Reported by. */
        by: string;

        /** Reason. */
        reason: string;
      };
}

/** SurveyModel. */
export class SurveyModel extends ModelFactory(Survey, {
  map: (data) => {
    if (data instanceof SurveyEntity) {
      return {
        ...ObjectUtils.pickProperties(data, ['id', 'rating', 'feedback', 'createdAt', 'updatedAt']),
        owner: data.isAnonymous ? undefined : data.owner.fullName,
        reported: (() => {
          if (!data.report) {
            return false;
          }

          if (data.report.reporter) {
            return {
              by: data.report.reporter.fullName,
              reason: data.report.reason,
            };
          }

          return true;
        })(),
      };
    }

    throw new NotImplementedException();
  },
}) {}
