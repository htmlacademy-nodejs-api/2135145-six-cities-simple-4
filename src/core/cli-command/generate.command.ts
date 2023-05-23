import got from 'got';
import OfferGenerator from '../../modules/offer-generator/offer-generator.js';
import { MockData } from '../../types/mock-data.type.js';
import TsvFileWriter from '../file-writer/tsv-file-writer.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...params: string[]): Promise<void> {
    const [count, filePath, url] = params;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.log(`Can not fetch data from ${ url }`);
      return;
    }

    const offerGeneratorString = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TsvFileWriter(filePath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }
    console.log(`File ${ filePath } was created!`);
  }
}
