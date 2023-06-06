import 'reflect-metadata';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './app/rest.container.js';
import Application from './app/rest.js';
import { createCityContainer } from './modules/city/city.container.js';
import { createOfferContainer } from './modules/offer/offer.container.js';
import { createUserContainer } from './modules/user/user.container.js';
import { AppComponent } from './types/app-component.enum.js';


async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCityContainer(),
    createOfferContainer());

  const application = mainContainer.get<Application>(AppComponent.Application);
  await application.init();
}

bootstrap();
