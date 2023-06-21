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

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {message: 'Minimum title length is 10'})
  @MaxLength(100, {message: 'Maximum title length is 100'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length is 20'})
  @MaxLength(1024, {message: 'Maximum description length is 1024'})
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
  @Min(1, {message: 'Minimum rooms value is 1'})
  @Max(8, {message: 'Maximum rooms value is 8'})
  public rooms?: number;

  @IsOptional()
  @IsInt({message: 'Guests must be an integer'})
  @Min(1, {message: 'Minimum guests value is 1'})
  @Max(10, {message: 'Maximum guests value is 10'})
  public guests?: number;

  @IsOptional()
  @IsInt({message: 'Price must be an integer'})
  @Min(100, {message: 'Minimum price value is 100'})
  @Max(100000, {message: 'Maximum price value is 100000'})
  public price?: number;

  @IsOptional()
  @IsArray({message: 'Goods must be an array'})
  @IsEnum(HouseType, {each: true, message: 'Must be one of HouseType'})
  public goods?: Good[];

  @IsOptional()
  @IsObject({message: 'must be a Location object'})
  public location?: Location;
}
