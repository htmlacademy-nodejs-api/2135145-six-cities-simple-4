import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Controller } from '../../core/controller/controller.abstract.js';
import HttpError from '../../core/errors/http-error.js';
import { fillDto } from '../../core/helpers/common.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.jsx';
import OfferBasicRdo from './rdo/offer-basic.rdo.js';
import OfferRdo from './rdo/offer.rdo.js';

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
              @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface) {
    super(logger);

    this.logger.info('Register routes for OfferController...');
    this.addRoute({path: '/', method: HttpMethod.POST, handler: this.create});
    this.addRoute({path: '/', method: HttpMethod.GET, handler: this.getOffers});
    this.addRoute({path: '/:userId', method: HttpMethod.GET, handler: this.getOffer});
    this.addRoute({path: '/:userId', method: HttpMethod.PATCH, handler: this.updateOffer});
    this.addRoute({path: '/:userId', method: HttpMethod.DELETE, handler: this.deleteOffer});
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDto(OfferRdo, result));
  }

  public async getOffers(
    _req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ) {
    const result = await this.offerService.find();
    this.ok(
      res,
      result.map((item) => fillDto(OfferBasicRdo, item)));
  }

  public async getOffer(
    { params }: Request<Record<string, string>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {
    const result = await this.offerService.findById(params.offerId);
    if(!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.id} is not found`,
        'OfferController'
      );
    }
    this.ok(res, fillDto(OfferRdo, result));
  }

  public async updateOffer(
    { params, body }: Request<Record<string, string>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {

    if (!params.offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'offerId is not provided',
        'OfferController'
      );
    }

    const result = await this.offerService.updateById(params.offerId, body);
    if(!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.id} is not found`,
        'OfferController'
      );
    }
    this.ok(res, fillDto(OfferRdo, result));
  }

  public async deleteOffer(
    { params }: Request<Record<string, string>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {
    if (!params.offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'offerId is not provided',
        'OfferController'
      );
    }
    const result = await this.offerService.deleteById(params.offerId);
    this.noContent(res, result);
  }

}
