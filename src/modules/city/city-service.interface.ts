import { DocumentType } from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { Location } from '../../types/location.type.js';
import { CityEntity } from './city.entity.js';

export interface CityServiceInterface {
  create(city: City, location: Location): Promise<DocumentType<CityEntity>>;
  findByName(cityName: string): Promise<DocumentType<CityEntity> | null>;
  findOrCreate(city: City, location: Location): Promise<DocumentType<CityEntity>>;
  find(): Promise<DocumentType<CityEntity>[]>;
}
