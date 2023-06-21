import { NextFunction, Request, Response } from 'express';
import mime from 'mime';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { MiddlewareInterface } from '../../types/middleware.interface.js';

export default class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename(_req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      }});

    const uploadSingleFileMiddleware = multer({storage}).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
