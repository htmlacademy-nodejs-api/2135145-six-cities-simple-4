import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray, IsBoolean,
  IsEnum, IsInt, IsObject,
  IsOptional,
  IsString, Max,
  MaxLength, Min,
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
  RoomsCount,
} from '../offer.const.js';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(OfferTitleLength.MIN, {message: `Minimum title length is ${OfferTitleLength.MIN}`})
  @MaxLength(OfferTitleLength.MAX, {message: `Maximum title length is ${OfferTitleLength.MAX}`})
  public title?: string;

  @IsOptional()
  @MinLength(OfferDescriptionLength.MIN, {message: `Minimum description length is ${OfferDescriptionLength.MIN}`})
  @MaxLength(OfferDescriptionLength.MAX, {message: `Maximum description length is ${OfferDescriptionLength.MAX}`})
  public description?: string;

  @IsOptional()
  @IsEnum(City, {message: 'Must be one of Cities type'})
  public city?: City;

  @IsOptional()
  @IsString({message: 'Must be a link to image'})
  public preview?: string;

  @IsOptional()
  @IsArray({message: 'Images must be an array'})
  @ArrayMinSize(6, {message: 'Images array length must be 6'})
  @ArrayMaxSize(6, {message: 'Images array length must be 6'})
  @IsString({each: true, message: 'Must be a link to image'})
  public images?: string[];

  @IsOptional()
  @IsBoolean({message: 'isPremium must be boolean value'})
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HouseType, {message: 'Must be one of HouseType'})
  public type?: HouseType;

  @IsOptional()
  @IsInt({message: 'Rooms must be an integer'})
  @Min(RoomsCount.MIN, {message: `Minimum rooms value is ${RoomsCount.MIN}`})
  @Max(RoomsCount.MAX, {message: `Maximum rooms value is ${RoomsCount.MAX}`})
  public rooms?: number;

  @IsOptional()
  @IsInt({message: 'Guests must be an integer'})
  @Min(GuestsCount.MIN, {message: `Minimum guests value is ${GuestsCount.MIN}`})
  @Max(GuestsCount.MAX, {message: `Maximum guests value is ${GuestsCount.MAX}`})
  public guests?: number;

  @IsOptional()
  @IsInt({message: 'Price must be an integer'})
  @Min(OfferPrice.MIN, {message: `Minimum price value is ${OfferPrice.MIN}`})
  @Max(OfferPrice.MAX, {message: `Maximum price value is ${OfferPrice.MAX}`})
  public price?: number;

  @IsOptional()
  @IsArray({message: 'Goods must be an array'})
  @IsEnum(HouseType, {each: true, message: 'Must be one of HouseType'})
  public goods?: Good[];

  @IsOptional()
  @IsObject({message: 'must be a Location object'})
  public location?: Location;
}
