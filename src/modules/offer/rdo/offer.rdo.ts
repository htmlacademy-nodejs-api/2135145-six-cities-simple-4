import { Expose, Type } from 'class-transformer';
import { City } from '../../../types/city.type.js';
import { Good } from '../../../types/good.type.js';
import { HouseType } from '../../../types/house-type.type.js';
import { Location } from '../../../types/location.type.js';
import CityRdo from '../../city/rdo/city.rdo.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public date!: Date;

  @Expose()
  public rating!: number;

  @Expose()
  @Type(() => CityRdo)
  public city!: City;

  @Expose()
  public preview!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public type!: HouseType;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: Good[];

  @Expose({name: 'hostId'})
  @Type(() => UserRdo)
  public host!: UserRdo;

  @Expose()
  public location!: Location;

  @Expose()
  public comments?: number;

}
