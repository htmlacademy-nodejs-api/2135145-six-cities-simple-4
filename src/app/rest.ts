import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { DatabaseClientInterface } from '../core/database-client/database-client.interface.js';
import { ExceptionFilterInterface } from '../core/exception-filters/exception-filter.interface.js';
import { getFullServerPath } from '../core/helpers/common.js';
import { getMongoURI } from '../core/helpers/db.js';
import { LoggerInterface } from '../core/logger/logger.interface.js';
import { AuthenticateMiddleware } from '../core/middlewares/authenticate.middleware.js';
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
              @inject(AppComponent.UserController) private readonly userController: UserController,
              @inject(AppComponent.OfferController) private readonly offerController: OfferController,
              @inject(AppComponent.CommentController) private readonly commentController: CommentController,
              @inject(AppComponent.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilterInterface,
              @inject(AppComponent.HttpErrorExceptionFilter) private readonly httpErrorExceptionFilter: ExceptionFilterInterface,
              @inject(AppComponent.BaseExceptionFilter) private readonly baseExceptionFilter: ExceptionFilterInterface) {
    this.expressApplication = express();
  }

  private async initDb() {
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

  private async initServer() {
    this.logger.info('Init server...');

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);
    this.logger.info(`🚀Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }

  private async initRoutes() {
    this.logger.info('Controllers initialization...');
    this.expressApplication.use('/users', this.userController.router);
    this.expressApplication.use('/offers', this.offerController.router);
    this.expressApplication.use('/comments', this.commentController.router);
    this.logger.info('Controllers initialization completed');
  }

  private async initMiddleware() {
    this.logger.info('Global middleware initialization...');
    this.expressApplication.use(express.json());
    this.expressApplication.use(
      '/upload', express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.expressApplication.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApplication.use(cors());

    this.logger.info('Global middleware initialization completed');
  }

  private async initExceptionFilters() {
    this.logger.info('Exception filters initialization...');
    this.expressApplication.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.expressApplication.use(this.httpErrorExceptionFilter.catch.bind(this.httpErrorExceptionFilter));
    this.expressApplication.use(this.baseExceptionFilter.catch.bind(this.baseExceptionFilter));
    this.logger.info('Exception filters initialized');
  }

  public async init() {
    this.logger.info('Application initialization...');
    await this.initDb();
    await this.initMiddleware();
    await this.initRoutes();
    await this.initExceptionFilters();
    await this.initServer();
  }
}
