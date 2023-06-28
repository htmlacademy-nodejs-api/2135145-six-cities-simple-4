import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { Controller } from '../../core/controller/controller.abstract.js';
import HttpError from '../../core/errors/http-error.js';
import { fillDto } from '../../core/helpers/common.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { PrivateRouteMiddleware } from '../../core/middlewares/private.route.middleware.js';
import ValidateDtoMiddleware from '../../core/middlewares/validate.dto.middleware.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { UnknownRecord } from '../../types/unknown-record.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import CommentRdo from './rdo/comment.rdo.js';

@injectable()
export default class CommentController extends Controller {
  constructor(@inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
              @inject(AppComponent.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
              @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
              @inject(AppComponent.ConfigInterface) protected readonly configService: ConfigInterface<RestSchema>){
    super(logger, configService);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({
      path: '/',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ],
    });
  }

  public async create(
    {body, user}: Request<UnknownRecord, UnknownRecord, CreateCommentDto>,
    res: Response): Promise<void> {

    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }
    const result = await this.commentService.create({...body, authorId: user.id});
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDto(CommentRdo, result));
  }
}
