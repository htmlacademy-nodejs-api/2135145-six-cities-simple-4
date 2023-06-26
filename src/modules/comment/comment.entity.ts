import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

export interface CommentEntity extends defaultClasses.Base{}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public text!: string;

  @prop({required: true})
  public date!: Date;

  @prop({required: true, min: 1.0, max: 5.0 })
  public rating!: number;

  @prop({
    ref: OfferEntity,
    required: true,
  })
  public offerId!: Ref<OfferEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public authorId!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);

