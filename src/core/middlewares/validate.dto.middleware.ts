import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import ValidationError from '../errors/validation-error.js';
import { transformErrors } from '../helpers/common.js';

export default class ValidateDtoMiddleware implements MiddlewareInterface {

  constructor(private readonly dto: ClassConstructor<object>) {}

  public async execute({body, path}: Request, _res: Response, next: NextFunction) {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);
    if(errors.length > 0) {
      throw new ValidationError(`Validation error ${path}`, transformErrors(errors));
    }
    next();
  }
}
