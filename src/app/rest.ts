import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { DatabaseClientInterface } from '../core/database-client/database-client.interface.js';
import { ExceptionFilterInterface } from '../core/exception-filters/exception-filter.interface.js';
import { getMongoURI } from '../core/helpers/db.js';
import { LoggerInterface } from '../core/logger/logger.interface.js';
import CityController from '../modules/city/city.controller.js';
import CommentController from '../modules/comment/comment.controller.js';
import OfferController from '../modules/offer/offer.controller.js';
import UserController from '../modules/user/user.controller.js';
import { AppComponent } from '../types/app-component.enum.js';

@injectable()
export default class Application {
  private expressApplication: Express;

  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
              @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
              @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
              @inject(AppComponent.CityController) private readonly cityController: CityController,
              @inject(AppComponent.UserController) private readonly userController: UserController,
              @inject(AppComponent.OfferController) private readonly offerController: OfferController,
              @inject(AppComponent.CommentController) private readonly commentController: CommentController,
              @inject(AppComponent.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface) {
    this.expressApplication = express();
  }

  private async _initDb() {
    this.logger.info('Init database...');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);
    this.logger.info('Init database completed');
  }

  private async _initServer() {
    this.logger.info('Init server...');

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);
    this.logger.info(`🚀Server started on port: ${port}`);
  }

  private async _initRoutes() {
    this.logger.info('Controllers initialization...');
    this.expressApplication.use('/cities', this.cityController.router);
    this.expressApplication.use('/users', this.userController.router);
    this.expressApplication.use('/offers', this.offerController.router);
    this.expressApplication.use('/comments', this.commentController.router);
    this.logger.info('Controllers initialization completed');
  }

  private async _initMiddleware() {
    this.logger.info('Global middleware initialization...');
    this.expressApplication.use(express.json());
    this.logger.info('Global middleware initialization completed');
  }

  private async _initExceptionFilters() {
    this.logger.info('Exception filters initialization...');
    this.expressApplication.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    this.logger.info('Exception filters initialized');

  }

  public async init() {
    this.logger.info('Application initialization...');
    await this._initDb();
    await this._initMiddleware();
    await this._initRoutes();
    await this._initExceptionFilters();
    await this._initServer();
  }
}
