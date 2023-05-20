import { readFileSync } from 'node:fs';
import { City } from '../../types/city.type.js';
import { HouseType } from '../../types/house-type.type.js';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from './file-reader-interface.js';

export default class TsvFileReader implements FileReaderInterface {
  private rawData = '';
  constructor(public filename: string) { }
  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    if(!this.rawData) {
      return [];
    }
    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
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
        longitude
      ]) => (
        {
          title,
          description,
          date,
          city: City[city as 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'],
          preview,
          images: Array.from(images.split(';')),
          isPremium: isPremium === 'true',
          rating: Number(rating),
          type: HouseType[type as 'apartment' | 'house' |'room' | 'hotel'],
          rooms: Number(rooms),
          guests: Number(guests),
          price: Number(price),
          goods: Array.from(goods.split(';')),
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
        }
      ));
  }
}
