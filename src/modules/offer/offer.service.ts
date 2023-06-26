import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { SortType } from '../../types/sort-type.type.js';
import { DEFAULT_OFFERS_LIMIT } from './offer.const.js';
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
    const result = await this.offerModel.create({...dto, comments: 0});
    this.logger.info(`Created offer: ${result}`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findById(offerId)
      .populate(['hostId'])
      .exec();
    if (offer) {
      const rating = await this.countRating(offerId);
      offer.rating = rating;
    }
    return offer;
  }

  public async countRating(offerId: string): Promise<number> {
    const values = await this.offerModel
      .aggregate([
        {
          $match: {
            '_id': new mongoose.Types.ObjectId(offerId),
          }
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments_info'
          },
        },
        {
          $project: {
            rating:  {
              $cond: { if: { $gte: [{ $size: '$comments_info'}, 1]}, then: { $avg: '$comments_info.rating'}, else: 0 }
            },
          }
        }
      ]).exec();

    return values[0]?.rating || 0;
  }

  public async find(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments_info',
          },
        },
        {
          $addFields:
            { id: { $toString: '$_id'},
              rating:
                {
                  $cond: { if: { $gte: [{ $size: '$comments_info'}, 1]}, then: { $avg: '$comments_info.rating'}, else: 0 }
                }
            }
        },
        { $unset: 'comments_info' },
      ])
      .limit(limit ?? DEFAULT_OFFERS_LIMIT)
      .sort({date: SortType.Down})
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['hostId'])
      .exec();
    if (offer) {
      const rating = await this.countRating(offerId);
      offer.rating = rating;
    }
    return offer;
  }

  public async exists(documentId: string) {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        comments: 1,
      }}).exec();
    if (offer) {
      const rating = await this.countRating(offerId);
      offer.rating = rating;
    }
    return offer;
  }
}
