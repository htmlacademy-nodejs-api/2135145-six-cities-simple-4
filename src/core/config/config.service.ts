import { config} from 'dotenv';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ConfigInterface } from './config.interface.js';
import { configRestSchema, RestSchema } from './rest.schema.js';

@injectable()
export default class ConfigService implements ConfigInterface<RestSchema> {
  private readonly config: RestSchema;
  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    const parsedOutput = config();

    if(parsedOutput.error) {
      this.logger.error('Error while parsing env file');
      throw new Error('Can not parse env file');
    }

    configRestSchema.load({});
    configRestSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configRestSchema.getProperties();
    this.logger.info('Env file is successfully parsed');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
