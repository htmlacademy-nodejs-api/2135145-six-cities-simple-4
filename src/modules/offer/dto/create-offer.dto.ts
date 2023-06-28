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
  MAX_GUESTS_COUNT,
  MAX_OFFER_DESCRIPTION_LENGTH, MAX_OFFER_PRICE,
  MAX_OFFER_TITLE_LENGTH, MAX_ROOMS_COUNT, MIN_GUESTS_COUNT,
  MIN_OFFER_DESCRIPTION_LENGTH, MIN_OFFER_PRICE,
  MIN_OFFER_TITLE_LENGTH, MIN_ROOMS_COUNT
} from '../offer.const.js';

export default class CreateOfferDto {
  @MinLength(MIN_OFFER_TITLE_LENGTH, {message: `Minimum title length is ${MIN_OFFER_TITLE_LENGTH}`})
  @MaxLength(MAX_OFFER_TITLE_LENGTH, {message: `Maximum title length is ${MAX_OFFER_TITLE_LENGTH}`})
  public title!: string;

  @MinLength(MIN_OFFER_DESCRIPTION_LENGTH, {message: `Minimum description length is ${MIN_OFFER_DESCRIPTION_LENGTH}`})
  @MaxLength(MAX_OFFER_DESCRIPTION_LENGTH, {message: `Maximum description length is ${MAX_OFFER_DESCRIPTION_LENGTH}`})
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
  @Min(MIN_ROOMS_COUNT, {message: `Minimum rooms value is ${MIN_ROOMS_COUNT}`})
  @Max(MAX_ROOMS_COUNT, {message: `Maximum rooms value is ${MAX_ROOMS_COUNT}`})
  public rooms!: number;

  @IsInt({message: 'Guests must be an integer'})
  @Min(MIN_GUESTS_COUNT, {message: `Minimum guests value is ${MIN_GUESTS_COUNT}`})
  @Max(MAX_GUESTS_COUNT, {message: `Maximum guests value is ${MAX_GUESTS_COUNT}`})
  public guests!: number;

  @IsInt({message: 'Price must be an integer'})
  @Min(MIN_OFFER_PRICE, {message: `Minimum price value is ${MIN_OFFER_PRICE}`})
  @Max(MAX_OFFER_PRICE, {message: `Maximum price value is ${MAX_OFFER_PRICE}`})
  public price!: number;

  @IsArray({message: 'Goods must be an array'})
  @IsEnum(Good, {each: true, message: 'Must be one of Goods'})
  public goods!: Good[];

  public hostId!: string;

  @IsObject({message: 'must be a Location object'})
  public location!: Location;
}
