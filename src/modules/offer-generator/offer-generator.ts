import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../core/helpers/index.js';
import { City } from '../../types/city.type.js';
import { HouseType } from '../../types/house-type.type.js';
import { MockData } from '../../types/mock-data.type.js';
import { RatingValue } from '../comment/comment.const.js';
import { GuestsCount, OfferPrice, RoomsCount } from '../offer/offer.const.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

const FIRST_WEEK_DAY = 1;
const LST_WEEK_DAY = 7;

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
    const rating = generateRandomValue(RatingValue.MIN, RatingValue.MAX);
    const type = getRandomItem([HouseType.house, HouseType.hotel, HouseType.room, HouseType.apartment]);
    const rooms = generateRandomValue(RoomsCount.MIN, RoomsCount.MAX);
    const guests = generateRandomValue(GuestsCount.MIN, GuestsCount.MAX);
    const price = generateRandomValue(OfferPrice.MIN, OfferPrice.MAX);
    const goods = getRandomItems<string>(this.mockData.goods);
    const name = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const password = generateRandomValue(1000, 12000);
    const userType = getRandomItem<string>(this.mockData.userTypes);
    const comments = generateRandomValue(1, 10);
    const latitude = generateRandomValue(1, 20, 6);
    const longitude = generateRandomValue(1, 20, 6);

    return [title, description, date, city,
      preview, images, isPremium, rating,
      type, rooms, guests, price,
      goods, name, email, avatar, password,
      userType, comments, latitude,longitude].join('\t');
  }
}
