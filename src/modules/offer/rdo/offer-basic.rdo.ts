import { Expose } from 'class-transformer';
import { City } from '../../../types/city.type.js';
import { HouseType } from '../../../types/house-type.type.js';


export default class OfferBasicRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public date!: Date;

  @Expose()
  public rating!: number;

  @Expose()
  public city!: City;

  @Expose()
  public preview!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public type!: HouseType;

  @Expose()
  public price!: number;

  @Expose()
  public comments?: number;
}
