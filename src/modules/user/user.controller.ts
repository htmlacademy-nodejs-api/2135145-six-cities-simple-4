import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { Controller } from '../../core/controller/controller.abstract.js';
import HttpError from '../../core/errors/http-error.js';
import { fillDto } from '../../core/helpers/common.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import CreateUserDto from './dto/create-user.dto.js';
import UserRdo from './rdo/user.rdo.js';
import { UserServiceInterface } from './user-service.interface.js';

@injectable()
export default class UserController extends Controller {

  constructor(@inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
              @inject(AppComponent.UserServiceInterface) private readonly userService: UserServiceInterface,
              @inject (AppComponent.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>) {
    super(logger);

    this.logger.info('Register routes for UserController...');
    this.addRoute({path: '/register', method: HttpMethod.POST, handler: this.create});
    this.addRoute({path: '/login', method: HttpMethod.POST, handler: this.login});
    this.addRoute({path: '/:userId/avatar', method: HttpMethod.POST, handler: this.updateAvatar});
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
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
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
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

  public async updateAvatar(
    { params, body }: Request<Record<string, string>, Record<string, unknown>, CreateUserDto>,
    res: Response): Promise<void> {
    const result = await this.userService.updateAvatar(params.userId, body.avatar);
    this.ok(res, fillDto(UserRdo, result));
  }
}
