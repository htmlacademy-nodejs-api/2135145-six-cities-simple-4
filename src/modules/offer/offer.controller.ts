import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { Controller } from '../../core/controller/controller.abstract.js';
import { fillDto } from '../../core/helpers/common.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { CheckAuthorityMiddleware } from '../../core/middlewares/check-authority.middleware.js';
import { DocumentExistsMiddleware } from '../../core/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../core/middlewares/private.route.middleware.js';
import ValidateDtoMiddleware from '../../core/middlewares/validate.dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../core/middlewares/validate.objectid.middleware.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { RequestQuery } from '../../types/request-query.js';
import { UnknownRecord } from '../../types/unknown-record.js';
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
              @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
              @inject(AppComponent.ConfigInterface) protected readonly configService: ConfigInterface<RestSchema>){
    super(logger, configService);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({path: '/', method: HttpMethod.GET, handler: this.index});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.GET,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.PATCH,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new CheckAuthorityMiddleware(this.offerService, 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new CheckAuthorityMiddleware(this.offerService, 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.GET,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')],
    });
  }

  public async create(
    { body, user }: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response): Promise<void> {
    const result = await this.offerService.create({...body, hostId: user.id});
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDto(OfferRdo, offer));
  }

  public async index(
    {query}: Request<UnknownRecord, UnknownRecord, UnknownRecord, RequestQuery>,
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
    this.ok(res, fillDto(OfferRdo, result));
  }

  public async update(
    { params, body }: Request<core.ParamsDictionary | ParamsGetOffer, object, UpdateOfferDto>,
    res: Response): Promise<void> {
    const {offerId} = params;

    const result = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDto(OfferRdo, result));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response): Promise<void> {
    const {offerId} = params;

    const result = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, result);
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const result = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDto(CommentRdo, result));
  }
}
