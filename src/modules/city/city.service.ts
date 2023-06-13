import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { City } from '../../types/city.type.js';
import { Location } from '../../types/location.type.js';
import { CityServiceInterface } from './city-service.interface.js';
import { CityEntity } from './city.entity.js';

@injectable()
export default class CityService implements CityServiceInterface {
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
              @inject(AppComponent.CityModel) private readonly cityModel: ModelType<CityEntity>) {}

  public async create(city: City, location: Location): Promise<DocumentType<CityEntity>> {
    const result = await this.cityModel.create({
      name: city,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    this.logger.info(`Created city: ${result}`);
    return result;
  }

  public async findByName(name: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({name});
  }

  public async findOrCreate(city: City, location: Location): Promise<DocumentType<CityEntity>> {
    const existingCity = await this.findByName(city);

    if(existingCity){
      return existingCity;
    }

    return this.create(city, location);
  }

  public async find(): Promise<DocumentType<CityEntity>[]> {
    return this.cityModel.find();
  }
}
