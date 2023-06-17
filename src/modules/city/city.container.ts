import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { ControllerInterface } from '../../core/controller/controller.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { CityServiceInterface } from './city-service.interface.js';
import CityController from './city.controller.js';
import { CityEntity, CityModel } from './city.entity.js';
import CityService from './city.service.js';

export function createCityContainer() {
  const cityContainer = new Container();

  cityContainer.bind<CityServiceInterface>(AppComponent.CityServiceInterface).to(CityService).inSingletonScope();
  cityContainer.bind<types.ModelType<CityEntity>>(AppComponent.CityModel).toConstantValue(CityModel);
  cityContainer.bind<ControllerInterface>(AppComponent.CityController).to(CityController).inSingletonScope();

  return cityContainer;
}
