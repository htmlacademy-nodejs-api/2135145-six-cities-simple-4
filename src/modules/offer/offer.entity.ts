import { defaultClasses, post, prop } from '@typegoose/typegoose';
import { Offer } from '../../types/offer.type.js';

export interface OfferEntity extends defaultClasses.Base {}
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  @prop({required: true, minlength: 10, maxlength: 100})
  public title = '';

  @prop({required: true, minlength: 20, maxlength: 1024})
  public description = '';

  @prop({required: true})
  public date;

  @prop({required: true})
  public city;

  @prop({required: true})
  public preview = '';

  @prop({required: true})
  public images = [];

  @prop({required: true})
  public isPremium = false;

  @prop({required: true, min: 1.0, max: 5.0 })
  public rating = 1;

  @prop({required: true})
  public type = '';

}
