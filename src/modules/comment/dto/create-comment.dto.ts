import { IsDateString, IsMongoId, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import {
  CommentLength,
  RatingValue
} from '../comment.const.js';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @MinLength(CommentLength.MIN, {message: `Min length of text is ${CommentLength.MIN}`})
  @MaxLength(CommentLength.MAX, {message: `Max length of text is ${CommentLength.MAX}`})
  public text!: string;

  @IsNumber({maxDecimalPlaces: 1},{message: 'Rating must be valid float'})
  @Min(RatingValue.MIN, {message: `Minimum rating value is ${RatingValue.MIN}`})
  @Max(RatingValue.MAX, {message: `Maximum rating value is ${RatingValue.MAX}`})
  public rating!: number;

  @IsMongoId({message: 'offerId field must be a valid id'})
  public offerId!: string;

  @IsDateString({}, {message: 'date is required'})
  public date!: Date;

  public authorId!: string;
}
