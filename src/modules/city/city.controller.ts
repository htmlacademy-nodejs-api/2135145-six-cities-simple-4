import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { Controller } from '../../core/controller/controller.abstract.js';
import { fillDto } from '../../core/helpers/common.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { CityServiceInterface } from './city-service.interface.js';
import CityRdo from './rdo/city.rdo.js';

@injectable()
export default class CityController extends Controller {
  constructor(@inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
              @inject(AppComponent.CityServiceInterface) private readonly cityService: CityServiceInterface,
              @inject(AppComponent.ConfigInterface) protected readonly configService: ConfigInterface<RestSchema>){
    super(logger, configService);

    this.logger.info('Register routes for CityController...');
    this.addRoute({path: '/', method: HttpMethod.GET, handler: this.index});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();
    const citiesToResponse = fillDto(CityRdo, cities);
    this.ok(res, citiesToResponse);
  }
}
