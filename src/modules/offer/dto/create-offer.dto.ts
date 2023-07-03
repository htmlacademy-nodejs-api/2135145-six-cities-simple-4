import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean, IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';
import { City } from '../../../types/city.type.js';
import { Good } from '../../../types/good.type.js';
import { HouseType } from '../../../types/house-type.type.js';
import { Location } from '../../../types/location.type.js';
import {
  GuestsCount,
  OfferDescriptionLength,
  OfferPrice,
  OfferTitleLength,
  RoomsCount
} from '../offer.const.js';

export default class CreateOfferDto {
  @MinLength(OfferTitleLength.MIN, {message: `Minimum title length is ${OfferTitleLength.MIN}`})
  @MaxLength(OfferTitleLength.MAX, {message: `Maximum title length is ${OfferTitleLength.MAX}`})
  public title!: string;

  @MinLength(OfferDescriptionLength.MIN, {message: `Minimum description length is ${OfferDescriptionLength.MIN}`})
  @MaxLength(OfferDescriptionLength.MAX, {message: `Maximum description length is ${OfferDescriptionLength.MAX}`})
  public description!: string;

  @IsDateString({}, {message: 'date is required'})
  public date!: Date;

  @IsEnum(City, {message: 'Must be one of Cities type'})
  public city!: City;

  @IsString({message: 'Must be a link to image'})
  public preview!: string;

  @IsArray({message: 'Images must be an array'})
  @ArrayMinSize(6, {message: 'Images array length must be 6'})
  @ArrayMaxSize(6, {message: 'Images array length must be 6'})
  @IsString({each: true, message: 'Must be a link to image'})
  public images!: string[];

  @IsBoolean({message: 'isPremium must be boolean value'})
  public isPremium!: boolean;

  @IsEnum(HouseType, {message: 'Must be one of HouseType'})
  public type!: HouseType;

  @IsInt({message: 'Rooms must be an integer'})
  @Min(RoomsCount.MIN, {message: `Minimum rooms value is ${RoomsCount.MIN}`})
  @Max(RoomsCount.MAX, {message: `Maximum rooms value is ${RoomsCount.MAX}`})
  public rooms!: number;

  @IsInt({message: 'Guests must be an integer'})
  @Min(GuestsCount.MIN, {message: `Minimum guests value is ${GuestsCount.MIN}`})
  @Max(GuestsCount.MAX, {message: `Maximum guests value is ${GuestsCount.MAX}`})
  public guests!: number;

  @IsInt({message: 'Price must be an integer'})
  @Min(OfferPrice.MIN, {message: `Minimum price value is ${OfferPrice.MIN}`})
  @Max(OfferPrice.MAX, {message: `Maximum price value is ${OfferPrice.MAX}`})
  public price!: number;

  @IsArray({message: 'Goods must be an array'})
  @IsEnum(Good, {each: true, message: 'Must be one of Goods'})
  public goods!: Good[];

  public hostId!: string;

  @IsObject({message: 'must be a Location object'})
  public location!: Location;
}
