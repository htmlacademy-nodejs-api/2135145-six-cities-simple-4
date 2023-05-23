import TsvFileReader from '../file-reader/tsv-file-reader.js';
import { createOffer } from '../helpers/offers.js';
import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private onLine(line: string) {
    const offer = createOffer(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
  }

  public async execute(filename: string): Promise<void> {
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
