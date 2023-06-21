import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

const {Types} = mongoose;

export default class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private readonly param: string) {}

  public execute({params}: Request, _res: Response, next: NextFunction) {
    const objectId = params[this.param];

    if(Types?.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Invalid ObjectId: ${objectId}`,
      'ValidateObjectIdMiddleware'
    );
  }
}
