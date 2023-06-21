import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import HttpError from '../../core/errors/http-error.js';
import { fillDto } from '../../core/helpers/common.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import ValidateDtoMiddleware from '../../core/middlewares/validate.dto.middleware.js';
import ValidateObjectIdMiddleware from '../../core/middlewares/validate.objectid.middleware.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { RequestQuery } from '../../types/request-query.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentRdo from '../comment/rdo/comment.rdo.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.jsx';
import OfferBasicRdo from './rdo/offer-basic.rdo.js';
import OfferRdo from './rdo/offer.rdo.js';

type ParamsGetOffer = {
  offerId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
              @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
              @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface) {
    super(logger);

    this.logger.info('Register routes for OfferController...');
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({path: '/', method: HttpMethod.GET, handler: this.index});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.GET,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.PATCH,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto)],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.GET,
      handler: this.getComments,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async create(
    { body }: Request<object, object, CreateOfferDto>,
    res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDto(OfferRdo, offer));
  }

  public async index(
    {query}: Request<object, object, unknown, RequestQuery>,
    res: Response
  ) {
    const result = await this.offerService.find(query.limit);
    this.ok(
      res,
      result.map((item) => fillDto(OfferBasicRdo, item)));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response): Promise<void> {
    const {offerId} = params;
    const result = await this.offerService.findById(offerId);
    if(!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} is not found`,
        'OfferController'
      );
    }
    this.ok(res, fillDto(OfferRdo, result));
  }

  public async update(
    { params, body }: Request<core.ParamsDictionary | ParamsGetOffer, object, UpdateOfferDto>,
    res: Response): Promise<void> {

    const {offerId} = params;

    const result = await this.offerService.updateById(offerId, body);
    if(!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} is not found`,
        'OfferController'
      );
    }
    this.ok(res, fillDto(OfferRdo, result));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response): Promise<void> {
    const {offerId} = params;

    const result = await this.offerService.deleteById(offerId);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }
    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, result);
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;

    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    const result = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDto(CommentRdo, result));
  }
}
