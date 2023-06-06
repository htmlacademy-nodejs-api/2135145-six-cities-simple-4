import { City } from '../../types/city.type.js';
import { HouseType } from '../../types/house-type.type.js';
import { Offer } from '../../types/offer.type.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    date,
    city,
    preview,
    images,
    isPremium,
    rating,
    type,
    rooms,
    guests,
    price,
    goods,
    name,
    email,
    avatar,
    password,
    isPro,
    comments,
    latitude,
    longitude,
  ] = offerData.replace('\n', '').split('\t');

  return {
    title,
    description,
    date: new Date(date),
    city: City[city as 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'],
    preview,
    images: Array.from(images.split(';')),
    isPremium: isPremium === 'true',
    rating: Number(rating),
    type: HouseType[type as 'apartment' | 'house' |'room' | 'hotel'],
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    goods: Array.from(goods.split(',')),
    host: {
      name,
      email,
      avatar,
      password,
      isPro: isPro === 'true',
    },
    comments: Number(comments),
    location: {
      latitude: Number(latitude),
      longitude: Number(longitude),
    },
  } as Offer;
}
