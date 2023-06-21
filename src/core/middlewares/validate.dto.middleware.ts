import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/middleware.interface.js';

export default class ValidateDtoMiddleware implements MiddlewareInterface {

  constructor(private readonly dto: ClassConstructor<object>) {}

  public async execute({body}: Request, res: Response, next: NextFunction) {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);
    if(errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }

    next();
  }
}
