import { IsDateString, IsMongoId, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { MAX_COMMENT_LENGTH, MAX_RATING_VALUE, MIN_COMMENT_LENGTH, MIN_RATING_VALUE } from '../comment.const.js';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @MinLength(MIN_COMMENT_LENGTH, {message: `Min length of text is ${MIN_COMMENT_LENGTH}`})
  @MaxLength(MAX_COMMENT_LENGTH, {message: `Max length of text is ${MAX_COMMENT_LENGTH}`})
  public text!: string;

  @IsNumber({maxDecimalPlaces: 1},{message: 'Rating must be valid float'})
  @Min(MIN_RATING_VALUE, {message: `Minimum rating value is ${MIN_RATING_VALUE}`})
  @Max(MAX_RATING_VALUE, {message: `Maximum rating value is ${MAX_RATING_VALUE}`})
  public rating!: number;

  @IsMongoId({message: 'offerId field must be a valid id'})
  public offerId!: string;

  @IsDateString({}, {message: 'date is required'})
  public date!: Date;

  public authorId!: string;
}
