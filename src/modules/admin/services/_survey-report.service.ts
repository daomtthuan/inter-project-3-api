import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { SurveyEntity, SurveyReportEntity, UserEntity } from '~/entities';

import { SurveyReportModel } from '../models';

/** SurveyReport admin service. */
@Injectable()
export class SurveyReportAdminService {
  private logger = new Logger(SurveyReportAdminService.name);

  constructor(
    /** DataSource. */
    private dataSource: DataSource,

    /** SurveyReport repository. */
    @InjectRepository(SurveyReportEntity)
    private surveyReportRepository: Repository<SurveyReportEntity>,
  ) {}

  /**
   * Create SurveyReport.
   *
   * @param user User.
   * @param survey Survey.
   * @param surveyReportModel SurveyReport model.
   *
   * @returns SurveyReport if reported, otherwise `null`.
   */
  async create(user: UserEntity, survey: SurveyEntity, surveyReportModel: SurveyReportModel): Promise<SurveyReportEntity | null> {
    const surveyReport = await this.surveyReportRepository.findOne({
      where: {
        surveyId: survey.id,
      },
    });
    if (surveyReport) {
      this.logger.debug('SurveyReport already reported');
      return null;
    }

    return this.dataSource.transaction(async (manager) => {
      const surveyReportRepository = manager.withRepository(this.surveyReportRepository);

      const createdSurveyReport = surveyReportRepository.create({
        reporter: user,
        survey: survey,
        reason: surveyReportModel.reason,
      });

      // Mark owner as inactive
      const { owner } = survey;
      owner.isActive = false;

      await owner.save();
      this.logger.debug('Owner marked as inactive', { user: survey.owner });

      await createdSurveyReport.save();
      this.logger.debug('SurveyReport created', { surveyReport: createdSurveyReport });

      return createdSurveyReport;
    });
  }
}
