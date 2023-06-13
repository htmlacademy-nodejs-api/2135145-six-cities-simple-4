import { City } from '../../../types/city.type.js';
import { Good } from '../../../types/good.type.js';
import { HouseType } from '../../../types/house-type.type.js';
import { Location } from '../../../types/location.type.js';

export default class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public preview?: string;
  public images?: string[];
  public isPremium?: boolean;
  public type?: HouseType;
  public rooms?: number;
  public guests?: number;
  public price?: number;
  public goods?: Good[];
  public location?: Location;
}
