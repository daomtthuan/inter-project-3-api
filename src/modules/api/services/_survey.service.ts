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

  /**
   * Get list of surveys.
   *
   * @param user User.
   *
   * @returns Surveys.
   */
  async getList(user: UserEntity): Promise<SurveyEntity[]> {
    const surveys = await this.surveyRepository.find({
      where: {
        ownerId: user.id,
      },
    });
    this.logger.debug('Surveys found', { surveys });

    return surveys;
  }

  /**
   * Get Survey.
   *
   * @param user User.
   * @param surveyId Survey id.
   *
   * @returns Survey if found, otherwise `null`.
   */
  async get(user: UserEntity, surveyId: string): Promise<SurveyEntity | null> {
    const survey = await this.getSurvey(user, surveyId);
    if (!survey) {
      this.logger.debug('Survey not found');
      return null;
    }

    this.logger.debug('Survey found', { survey });
    return survey;
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
    const surveysInDay = await this.getSurveysInDay(user);
    if (surveysInDay.length) {
      this.logger.debug('Survey already exist in day');
      return null;
    }

    const surveysInMonth = await this.getSurveysInMonth(user);
    if (surveysInMonth.length > 5) {
      this.logger.debug('Too many surveys in month');
      return null;
    }

    const createdSurvey = this.surveyRepository.create({
      rating: surveyModel.rating,
      feedback: surveyModel.feedback,
      isAnonymous: surveyModel.isAnonymous,
      owner: user,
    });

    await createdSurvey.save();
    this.logger.debug('Survey created', { survey: createdSurvey });

    return createdSurvey;
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
    const survey = await this.getSurvey(user, surveyId);
    if (!survey) {
      this.logger.debug('Survey not found');
      return null;
    }

    survey.rating = surveyModel.rating;
    survey.feedback = surveyModel.feedback;
    survey.isAnonymous = surveyModel.isAnonymous;

    await survey.save();
    this.logger.debug('Survey updated', { survey });

    return survey;
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
    const survey = await this.getSurvey(user, surveyId);
    if (!survey) {
      this.logger.debug('Survey not found');
      return null;
    }

    const removedSurvey = await this.surveyRepository.softRemove(survey);
    this.logger.debug('Survey deleted', { survey });

    return removedSurvey;
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
        ownerId: user.id,
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
        ownerId: user.id,
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
        ownerId: user.id,
        createdAt: Between(startOfMonth, endOfMonth),
      },
      withDeleted: true,
    });
  }
}
