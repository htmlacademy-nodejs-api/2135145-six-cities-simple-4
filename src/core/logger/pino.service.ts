import { injectable } from 'inversify';
import { Logger, pino } from 'pino';
import { LoggerInterface } from './logger.interface';

@injectable()
export default class PinoService implements LoggerInterface {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino();
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, args);
  }
}
