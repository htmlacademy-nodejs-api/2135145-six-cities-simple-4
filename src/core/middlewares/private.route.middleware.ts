import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute({ user }: Request, _res: Response, next: NextFunction): Promise<void> {
    if(!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
