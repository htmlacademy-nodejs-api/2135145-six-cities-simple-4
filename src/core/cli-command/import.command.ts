import { CityServiceInterface } from '../../modules/city/city-service.interface.js';
import { CityModel } from '../../modules/city/city.entity.js';
import CityService from '../../modules/city/city.service.js';
import { OfferServiceInterface } from '../../modules/offer/offer-service.interface.js';
import { OfferModel } from '../../modules/offer/offer.entity.js';
import OfferService from '../../modules/offer/offer.service.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import { UserModel } from '../../modules/user/user.entity.js';
import UserService from '../../modules/user/user.service.js';
import { City } from '../../types/city.type.js';
import { Offer } from '../../types/offer.type.js';
import { DatabaseClientInterface } from '../database-client/database-client.interface.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import TsvFileReader from '../file-reader/tsv-file-reader.js';
import { getMongoURI } from '../helpers/db.js';
import { createOffer } from '../helpers/offers.js';
import ConsoleLoggerService from '../logger/console.service.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';


const DEFAULT_DB_PORT = '27017';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private cityService!: CityServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private logger!: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.logger = new ConsoleLoggerService();
    this.userService = new UserService(this.logger, UserModel);
    this.cityService = new CityService(this.logger, CityModel);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async loadCities() {
    await this.cityService.findOrCreate(City.Paris, {latitude: 48.85661, longitude:  2.351499});
    await this.cityService.findOrCreate(City.Cologne, {latitude: 50.938361, longitude: 6.959974});
    await this.cityService.findOrCreate(City.Brussels, {latitude: 50.846557, longitude: 4.351697});
    await this.cityService.findOrCreate(City.Amsterdam, {latitude: 52.370216, longitude: 4.895168});
    await this.cityService.findOrCreate(City.Hamburg, {latitude: 53.550341, longitude: 10.000654});
    await this.cityService.findOrCreate(City.Dusseldorf, {latitude: 51.225402, longitude: 6.776314});
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({...offer.host}, this.salt);

    await this.offerService.create({
      ...offer,
      host: user.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);
    await this.loadCities();

    const fileReader = new TsvFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('complete', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(chalk.red(`Не удалось импортировать данные из файла по причине: «${err instanceof Error ? err.message : ''}»`));
    }
  }
}
