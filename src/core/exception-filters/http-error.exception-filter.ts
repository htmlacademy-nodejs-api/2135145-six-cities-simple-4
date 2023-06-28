import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { ServiceError } from '../../types/service-error.enum.js';
import HttpError from '../errors/http-error.js';
import { createErrorObject } from '../helpers/common.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ExceptionFilterInterface } from './exception-filter.interface.js';

@injectable()
export default class HttpErrorExceptionFilter implements ExceptionFilterInterface {

  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction) {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }
}
