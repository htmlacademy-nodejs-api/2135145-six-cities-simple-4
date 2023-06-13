import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { SortType } from "../../types/sort-type.type";
import { CommentServiceInterface } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(@inject(AppComponent.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>) {
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .limit(50)
      .populate('authorId')
      .sort({date: SortType.Down})
  }

  public async deleteByOfferId(offerId:string): Promise<number | null> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();
    return result.deletedCount;
  }
}
