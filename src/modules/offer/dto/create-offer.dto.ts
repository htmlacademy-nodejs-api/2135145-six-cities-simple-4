import { City } from '../../../types/city.type.js';
import { Good } from '../../../types/good.type.js';
import { HouseType } from '../../../types/house-type.type.js';
import { Location } from '../../../types/location.type.js';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public date!: Date;
  public city!: City;
  public preview!: string;
  public images!: string[];
  public isPremium!: boolean;
  public rating!: number;
  public type!: HouseType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public goods!: Good[];
  public host!: string;
  public location!: Location;
}
