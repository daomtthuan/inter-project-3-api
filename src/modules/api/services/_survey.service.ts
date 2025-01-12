import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { SurveyEntity, UserEntity } from '~/entities';

import { SurveyModel } from '../models';

/** Survey api service. */
@Injectable()
export class SurveyApiService {
  private logger = new Logger(SurveyApiService.name);

  constructor(
    /** Survey repository. */
    @InjectRepository(SurveyEntity)
    private surveyRepository: Repository<SurveyEntity>,
  ) {}

  async getList(user: UserEntity): Promise<SurveyEntity[]> {
    const surveys = await this.surveyRepository.find({
      where: {
        userId: user.id,
      },
    });
    this.logger.debug('Surveys found', { surveys });

    return surveys;
  }

  /**
   * Get a survey.
   *
   * @param user User.
   * @param surveyId Survey id.
   *
   * @returns Survey if found, otherwise `null`.
   */
  async get(user: UserEntity, surveyId: string): Promise<SurveyEntity | null> {
    const existedSurvey = await this.getSurvey(user, surveyId);
    if (!existedSurvey) {
      this.logger.debug('Survey not found');
      return null;
    }

    this.logger.debug('Survey found', { survey: existedSurvey });
    return existedSurvey;
  }

  /**
   * Create a new survey.
   *
   * @param user User.
   * @param surveyModel Survey model.
   *
   * @returns Survey if created, otherwise `null`.
   */
  async create(user: UserEntity, surveyModel: SurveyModel): Promise<SurveyEntity | null> {
    const existedSurveysInDay = await this.getSurveysInDay(user);
    if (existedSurveysInDay.length) {
      this.logger.debug('Survey already exist in day');
      return null;
    }

    const existedSurveysInMonth = await this.getSurveysInMonth(user);
    if (existedSurveysInMonth.length > 5) {
      this.logger.debug('Too many surveys in month');
      return null;
    }

    const survey = this.surveyRepository.create({
      rating: surveyModel.rating,
      feedback: surveyModel.feedback,
      isAnonymous: surveyModel.isAnonymous,
      user,
    });

    await survey.save();
    this.logger.debug('Survey created', { survey });

    return survey;
  }

  /**
   * Update a new survey.
   *
   * @param user User.
   * @param surveyId Survey id.
   * @param surveyModel Survey model.
   *
   * @returns Updated Survey.
   */
  async update(user: UserEntity, surveyId: string, surveyModel: SurveyModel): Promise<SurveyEntity | null> {
    const existedSurvey = await this.getSurvey(user, surveyId);
    if (!existedSurvey) {
      this.logger.debug('Survey not found');
      return null;
    }

    existedSurvey.rating = surveyModel.rating;
    existedSurvey.feedback = surveyModel.feedback;
    existedSurvey.isAnonymous = surveyModel.isAnonymous;

    await existedSurvey.save();
    this.logger.debug('Survey updated', { survey: existedSurvey });

    return existedSurvey;
  }

  /**
   * Delete a survey.
   *
   * @param user User.
   * @param surveyId Survey id.
   *
   * @returns Survey if deleted, otherwise `null`.
   */
  async delete(user: UserEntity, surveyId: string): Promise<SurveyEntity | null> {
    const existedSurvey = await this.getSurvey(user, surveyId);
    if (!existedSurvey) {
      this.logger.debug('Survey not found');
      return null;
    }

    const survey = await this.surveyRepository.softRemove(existedSurvey);
    this.logger.debug('Survey deleted', { survey });

    return survey;
  }

  /**
   * Get existed Survey.
   *
   * @param user User.
   * @param surveyId Survey id.
   *
   * @returns Survey if found, otherwise `null`.
   */
  private async getSurvey(user: UserEntity, surveyId: string): Promise<SurveyEntity | null> {
    return this.surveyRepository.findOne({
      where: {
        id: surveyId,
        userId: user.id,
      },
    });
  }

  /**
   * Get surveys in day.
   *
   * @param user User.
   *
   * @returns Surveys in day.
   */
  private async getSurveysInDay(user: UserEntity): Promise<SurveyEntity[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return this.surveyRepository.find({
      where: {
        userId: user.id,
        createdAt: Between(startOfDay, endOfDay),
      },
      withDeleted: true,
    });
  }

  /**
   * Get surveys in month.
   *
   * @param user User.
   *
   * @returns Surveys in month.
   */
  private async getSurveysInMonth(user: UserEntity): Promise<SurveyEntity[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return this.surveyRepository.find({
      where: {
        userId: user.id,
        createdAt: Between(startOfMonth, endOfMonth),
      },
      withDeleted: true,
    });
  }
}
