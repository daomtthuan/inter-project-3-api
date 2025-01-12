import { Body, Get, NotFoundException, Param, Post, Req } from '@nestjs/common';

import { TooManyRequestException } from '~/common/exceptions/http';
import { RequestWithUser } from '~/common/types/http';

import { AdminController } from '../_.decorator';
import { SurveyModel, SurveyReportModel } from '../models';
import { SurveyAdminService, SurveyReportAdminService } from '../services';

/** Survey admin controller. */
@AdminController('survey')
export class SurveyAdminController {
  constructor(
    /** Survey admin service. */
    private surveyAdminService: SurveyAdminService,

    /** Survey report admin service. */
    private surveyReportAdminService: SurveyReportAdminService,
  ) {}

  /**
   * Get survey list.
   *
   * @returns List of surveys.
   */
  @Get('list')
  async list(): Promise<SurveyModel[]> {
    const surveys = await this.surveyAdminService.getList();

    return surveys.map((survey) =>
      SurveyModel.create(survey, {
        omit: ['feedback', 'reported'],
      }),
    );
  }

  /**
   * Get survey.
   *
   * @param surveyId Survey id.
   *
   * @returns Survey.
   */
  @Get(':id')
  async get(@Param('id') surveyId: string): Promise<SurveyModel> {
    const survey = await this.surveyAdminService.getWithReporter(surveyId);
    if (!survey) {
      throw new NotFoundException();
    }

    return SurveyModel.create(survey);
  }

  /**
   * Get survey.
   *
   * @param surveyId Survey id.
   *
   * @returns Survey.
   */
  @Post(':id/report')
  async report(@Req() { user }: RequestWithUser, @Param('id') surveyId: string, @Body() surveyReportModel: SurveyReportModel): Promise<SurveyReportModel> {
    const survey = await this.surveyAdminService.get(surveyId);
    if (!survey) {
      throw new NotFoundException();
    }

    const surveyReport = await this.surveyReportAdminService.create(user, survey, surveyReportModel);
    if (!surveyReport) {
      throw new TooManyRequestException('Survey report creation limit reached');
    }

    return SurveyReportModel.create(surveyReport, {
      pick: ['surveyId', 'reason', 'createdAt'],
    });
  }
}
