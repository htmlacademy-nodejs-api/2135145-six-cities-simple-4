import { Expose, Type } from 'class-transformer';
import { User } from '../../../types/user.type.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export default class CommentRdo {
  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public date!: Date;

  @Expose({name: 'authorId'})
  @Type(() => UserRdo)
  public author!: User;
}
