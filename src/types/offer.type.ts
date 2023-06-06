import { City } from './city.type.js';
import { HouseType } from './house-type.type.js';
import { Location } from './location.type.js';
import { User } from './user.type.js';

export type Offer = {
  title: string,
  description: string,
  date: Date,
  city: City,
  preview: string,
  images: string[],
  isPremium: boolean,
  rating: number,
  type: HouseType,
  rooms: number,
  guests: number,
  price: number,
  goods: string[],
  host: User,
  comments?: number,
  location: Location,
}