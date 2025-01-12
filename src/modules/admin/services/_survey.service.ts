import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, IsNull, Repository } from 'typeorm';

import { SurveyEntity, SurveyReportEntity } from '~/entities';

/** Survey admin service. */
@Injectable()
export class SurveyAdminService {
  private logger = new Logger(SurveyAdminService.name);

  constructor(
    /** Survey repository. */
    @InjectRepository(SurveyEntity)
    private surveyRepository: Repository<SurveyEntity>,
  ) {}

  /**
   * Get list of surveys.
   *
   * @param user User.
   *
   * @returns Surveys.
   */
  async getList(): Promise<SurveyEntity[]> {
    const surveys = await this.surveyRepository.find({
      where: {
        report: {
          id: IsNull(),
        },
      },
      relations: {
        owner: true,
      },
    });
    this.logger.debug('Surveys found', { surveys });

    return surveys;
  }

  /**
   * Get Survey.
   *
   * @param surveyId Survey id.
   *
   * @returns Survey if found, otherwise `null`.
   */
  async get(surveyId: string): Promise<SurveyEntity | null> {
    const survey = await this.getSurvey(surveyId);
    if (!survey) {
      this.logger.debug('Survey not found');
      return null;
    }

    this.logger.debug('Survey found', { survey });
    return survey;
  }

  /**
   * Get Survey with reporter.
   *
   * @param surveyId Survey id.
   *
   * @returns Survey with reporter if found, otherwise `null`.
   */
  async getWithReporter(surveyId: string): Promise<SurveyEntity | null> {
    const survey = await this.getSurvey(surveyId, {
      reporter: true,
    });
    if (!survey) {
      this.logger.debug('Survey not found');
      return null;
    }

    this.logger.debug('Survey found', { survey });
    return survey;
  }

  /**
   * Get existed Survey.
   *
   * @param surveyId Survey id.
   * @param reportRelations Report relations.
   *
   * @returns Survey if found, otherwise `null`.
   */
  private async getSurvey(surveyId: string, reportRelations: boolean | FindOptionsRelations<SurveyReportEntity> = true): Promise<SurveyEntity | null> {
    return this.surveyRepository.findOne({
      where: {
        id: surveyId,
      },
      relations: {
        owner: true,
        report: reportRelations,
      },
    });
  }
}
