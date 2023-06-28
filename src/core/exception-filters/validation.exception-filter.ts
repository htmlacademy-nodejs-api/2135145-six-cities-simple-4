import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { ServiceError } from '../../types/service-error.enum.js';
import ValidationError from '../errors/validation-error.js';
import { createErrorObject } from '../helpers/common.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ExceptionFilterInterface } from './exception-filter.interface.js';

@injectable()
export default class ValidationExceptionFilter implements ExceptionFilterInterface {

  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${ error.message }`);

    error.details.forEach(
      (errorField) => this.logger.error(`[${ errorField.property }] — ${ errorField.messages }`)
    );

    res.status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }
}
