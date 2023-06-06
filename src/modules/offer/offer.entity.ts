import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { Good } from '../../types/good.type.js';
import { HouseType } from '../../types/house-type.type.js';
import { Location } from '../../types/location.type.js';
import { UserEntity } from '../user/user.entity.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true, minlength: 10, maxlength: 100})
  public title!: string;

  @prop({required: true, minlength: 20, maxlength: 1024})
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

  @prop({required: true, min: 1.0, max: 5.0 })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HouseType,
  })
  public type!: HouseType;

  @prop({ required: true, min: 1, max: 8 })
  public rooms!: number;

  @prop({required: true, min: 1, max: 10})
  public guests!: number;

  @prop({required: true, min: 100, max: 100000})
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
  public host!: Ref<UserEntity>;

  public comments?: number;
  @prop({
    required: true,
  })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
