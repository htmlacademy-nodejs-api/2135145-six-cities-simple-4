import 'reflect-metadata';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './app/rest.container.js';
import Application from './app/rest.js';
import { createCommentContainer } from './modules/comment/comment.container.js';
import { createOfferContainer } from './modules/offer/offer.container.js';
import { createUserContainer } from './modules/user/user.container.js';
import { AppComponent } from './types/app-component.enum.js';


async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer());

  const application = mainContainer.get<Application>(AppComponent.Application);
  await application.init();
}

bootstrap();
