import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { SortType } from '../../types/sort-type.type.js';
import { DEFAULT_OFFERS_LIMIT } from './const.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Created offer: ${result}`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['hostId'])
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: {offerId: '$_id'},
            pipeline: [
              {$match: {$expr: {$in: ['$$offerId', '$offers']}}},
              {$project: { _id: 1, rating: 2}}
            ],
            as: 'comments_info',
          }
        },
        {
          $addFields:
            { id: { $toString: '$_id'}, comments: { $size: '$offers'}, rating: { $avg: '$rating'} }
        },
        { $unset: 'comments_info' },
      ])
      .exec();
  }

  public async find(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .populate(['hostId'])
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: {offerId: '$_id'},
            pipeline: [
              {$match: {$expr: {$in: ['$$offerId', '$offers']}}},
              {$project: { _id: 1, rating: 2}}
            ],
            as: 'comments_info',
          }
        },
        {
          $addFields:
            { id: { $toString: '$_id'}, comments: { $size: '$comments'}, rating: { $avg: '$rating'}}
        },
        { $unset: 'comments_info' },
      ])
      .limit(limit ?? DEFAULT_OFFERS_LIMIT)
      .sort({date: SortType.Down})
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['hostId'])
      .exec();
  }

  public async exists(documentId: string) {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        comments: 1,
      }}).exec();
  }
}
