import { Body, Delete, Get, NotFoundException, Param, Patch, Post, Req } from '@nestjs/common';

import { TooManyRequestException } from '~/common/exceptions/http';
import { RequestTypeWithUser } from '~/common/types/http';

import { ApiController } from '../_.decorator';
import { SurveyModel } from '../models';
import { SurveyApiService } from '../services';

/** Survey api controller. */
@ApiController('survey')
export class SurveyApiController {
  constructor(
    /** Survey api service. */
    private surveyApiService: SurveyApiService,
  ) {}

  /**
   * Get survey list.
   *
   * @param req Request.
   *
   * @returns List of surveys.
   */
  @Get('list')
  async list(@Req() { user }: RequestTypeWithUser): Promise<SurveyModel[]> {
    const surveys = await this.surveyApiService.getList(user);

    return surveys.map((survey) =>
      SurveyModel.create(survey, {
        omit: ['feedback'],
      }),
    );
  }

  /**
   * Get survey.
   *
   * @param req Request.
   * @param surveyId Survey id.
   *
   * @returns Survey.
   */
  @Get(':id')
  async get(@Req() { user }: RequestTypeWithUser, @Param('id') surveyId: string): Promise<SurveyModel> {
    const survey = await this.surveyApiService.get(user, surveyId);
    if (!survey) {
      throw new NotFoundException();
    }

    return SurveyModel.create(survey);
  }

  /**
   * Create survey.
   *
   * @param req Request.
   * @param surveyModel Body.
   *
   * @returns Created Survey.
   */
  @Post()
  async create(@Req() { user }: RequestTypeWithUser, @Body() surveyModel: SurveyModel): Promise<SurveyModel> {
    const survey = await this.surveyApiService.create(user, surveyModel);
    if (!survey) {
      throw new TooManyRequestException('Survey creation limit reached');
    }

    return SurveyModel.create(survey, {
      pick: ['id', 'createdAt'],
    });
  }

  /**
   * Update survey.
   *
   * @param req Request.
   * @param surveyId Survey id.
   * @param surveyModel Body.
   *
   * @returns Updated Survey.
   */
  @Patch(':id')
  async update(@Req() { user }: RequestTypeWithUser, @Param('id') surveyId: string, @Body() surveyModel: SurveyModel): Promise<SurveyModel> {
    const survey = await this.surveyApiService.update(user, surveyId, surveyModel);
    if (!survey) {
      throw new NotFoundException();
    }

    return SurveyModel.create(survey, {
      pick: ['id', 'updatedAt'],
    });
  }

  /**
   * Delete survey.
   *
   * @param req Request.
   * @param surveyId Survey id.
   *
   * @returns Deleted Survey.
   */
  @Delete(':id')
  async delete(@Req() { user }: RequestTypeWithUser, @Param('id') surveyId: string): Promise<SurveyModel> {
    const survey = await this.surveyApiService.delete(user, surveyId);
    if (!survey) {
      throw new NotFoundException();
    }

    return SurveyModel.create(survey, {
      pick: ['id', 'deletedAt'],
    });
  }
}
