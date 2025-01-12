import { HttpException, HttpExceptionBodyMessage, HttpExceptionOptions, HttpStatus } from '@nestjs/common';

/** Too many request exception. */
export class TooManyRequestException extends HttpException {
  constructor(objectOrError: HttpExceptionBodyMessage = '', descriptionOrOptions: string | HttpExceptionOptions = 'Too Many Requests') {
    const { description = '', httpExceptionOptions } = HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

    super(HttpException.createBody(objectOrError, description, HttpStatus.TOO_MANY_REQUESTS), HttpStatus.TOO_MANY_REQUESTS, httpExceptionOptions);
  }
}
