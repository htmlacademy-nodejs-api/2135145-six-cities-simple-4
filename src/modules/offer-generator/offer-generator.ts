import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../core/helpers/index.js';
import { City } from '../../types/city.type.js';
import { HouseType } from '../../types/house-type.type.js';
import { MockData } from '../../types/mock-data.type.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

const FIRST_WEEK_DAY = 1;
const LST_WEEK_DAY = 7;

const MIN_PRICE = 500;
const MAX_PRICE = 5000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROOMS = 6;

const MIN_GUESTS = 1;
const MAX_GUESTS = 8;

const IMAGES_COUNT = 6;
export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const date = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem([City.Amsterdam, City.Brussels, City.Cologne, City.Paris, City.Hamburg, City.Dusseldorf]);
    const preview = getRandomItem<string>(this.mockData.images);
    const images = getRandomItems(this.mockData.images, IMAGES_COUNT);
    const isPremium = Boolean(generateRandomValue(0, 1));
    const rating = generateRandomValue(MIN_RATING, MAX_RATING);
    const type = getRandomItem([HouseType.house, HouseType.hotel, HouseType.room, HouseType.apartment]);
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItems<string>(this.mockData.goods);
    const name = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = generateRandomValue(1000, 12000);
    const isPro = Boolean(generateRandomValue(0,1));
    const comments = generateRandomValue(1, 10);
    const latitude = generateRandomValue(1, 20, 6);
    const longitude = generateRandomValue(1, 20, 6);

    return [title, description, date, city,
      preview, images, isPremium, rating,
      type, rooms, guests, price,
      goods, name, email, avatar, password,
      isPro, comments, latitude,longitude].join('\t');
  }
}
