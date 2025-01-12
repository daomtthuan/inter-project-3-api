import { NotImplementedException } from '@nestjs/common';
import { IsBoolean, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

import { ModelBase, ModelFactory } from '~/common/base/model';
import { SurveyEntity } from '~/entities';

/** Survey. */
class Survey extends ModelBase {
  /** Rating. */
  @IsNumber()
  @Min(1)
  @Max(10)
  rating!: number;

  /** Feedback. */
  @IsString()
  @MaxLength(1000)
  feedback?: string;

  /** Anonymous. */
  @IsBoolean()
  isAnonymous!: boolean;
}

/** SurveyModel. */
export class SurveyModel extends ModelFactory(Survey, {
  map: (data) => {
    if (data instanceof SurveyEntity) {
      return {
        id: data.id,
        rating: data.rating,
        feedback: data.feedback,
        isAnonymous: data.isAnonymous,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
      };
    }

    throw new NotImplementedException();
  },
}) {}
