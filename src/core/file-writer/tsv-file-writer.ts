import { createWriteStream } from 'node:fs';
import { WriteStream } from 'node:fs';
import { FileWriterInterface } from './file-writer.interface.js';

const CHUNK_SIZE = 2 ** 16; // 64KB
export default class TsvFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: CHUNK_SIZE,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
    return Promise.resolve();
  }

}
