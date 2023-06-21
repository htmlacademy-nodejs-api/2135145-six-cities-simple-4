import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { Controller } from '../../core/controller/controller.abstract.js';
import HttpError from '../../core/errors/http-error.js';
import { fillDto } from '../../core/helpers/common.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { DocumentExistsMiddleware } from '../../core/middlewares/document-exists.middleware.js';
import UploadFileMiddleware from '../../core/middlewares/upload-file.middleware.js';
import ValidateDtoMiddleware from '../../core/middlewares/validate.dto.middleware.js';
import ValidateObjectIdMiddleware from '../../core/middlewares/validate.objectid.middleware.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import CreateUserDto from './dto/create-user.dto.js';
import UserLoginDto from './dto/login-user.dto.js';
import UserRdo from './rdo/user.rdo.js';
import { UserServiceInterface } from './user-service.interface.js';

@injectable()
export default class UserController extends Controller {

  constructor(@inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
              @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
              @inject (AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>) {
    super(logger);

    this.logger.info('Register routes for UserController...');
    this.addRoute({
      path: '/register',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.POST,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(UserLoginDto)]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.POST,
      handler: this.updateAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });
  }

  public async create(
    { body }: Request<object, object, CreateUserDto>,
    res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if(existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists`,
        'UserController'
      );
    }
    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDto(UserRdo, result));
  }

  public async login(
    { body }: Request<object, object, CreateUserDto>,
    _res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if(!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }


  public async updateAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
