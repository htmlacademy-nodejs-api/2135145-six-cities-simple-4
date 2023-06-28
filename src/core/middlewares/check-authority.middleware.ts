import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { OfferServiceInterface } from '../../modules/offer/offer-service.interface.js';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export class CheckAuthorityMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: OfferServiceInterface,
    private readonly paramName: string,
  ) {}

  public execute = async({params, user}: Request, _res: Response, next: NextFunction): Promise<void> => {
    const documentId = params[this.paramName];
    const result = await this.service.findById(documentId);
    if (result?.hostId.id === user.id) {
      return next();
    }

    throw new HttpError(
      StatusCodes.FORBIDDEN,
      `You have no rights to edit Offer ${documentId}`,
      'CheckAuthorityMiddleware'
    );
  };
}
