import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { Good } from '../../types/good.type.js';
import { HouseType } from '../../types/house-type.type.js';
import { Location } from '../../types/location.type.js';
import { UserEntity } from '../user/user.entity.js';
import { GuestsCount, OfferDescriptionLength, OfferPrice, OfferTitleLength, RoomsCount } from './offer.const.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true, minlength: OfferTitleLength.MIN, maxlength: OfferTitleLength.MAX})
  public title!: string;

  @prop({required: true, minlength:OfferDescriptionLength.MIN, maxlength: OfferDescriptionLength.MAX})
  public description!: string;

  @prop({required: true})
  public date!: Date;

  @prop({
    required: true,
    type: () => String,
    enum: City,
  })
  public city!: City;

  @prop({required: true})
  public preview!: string;

  @prop({
    required: true,
    type: [String],
  })
  public images!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HouseType,
  })
  public type!: HouseType;

  @prop({ required: true, min: RoomsCount.MIN, max: RoomsCount.MAX })
  public rooms!: number;

  @prop({required: true, min: GuestsCount.MIN, max: GuestsCount.MAX})
  public guests!: number;

  @prop({required: true, min: OfferPrice.MIN, max: OfferPrice.MAX})
  public price!: number;

  @prop({
    required: true,
    enum: Good,
    type: [String],
  })
  public goods!: Good[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public hostId!: Ref<UserEntity>;

  @prop()
  public comments?: number;

  @prop({
    required: true,
  })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
