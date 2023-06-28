import { NextFunction, Request, Response } from 'express';
import { extension } from 'mime-types';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { MiddlewareInterface } from '../../types/middleware.interface.js';

export default class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
  ) {}

  public execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtentions = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${ filename }.${ fileExtentions }`);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  };
}
