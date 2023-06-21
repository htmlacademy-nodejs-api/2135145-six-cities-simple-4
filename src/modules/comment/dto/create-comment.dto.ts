import { IsMongoId, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @MinLength(5, {message: 'Min length of text is 5'})
  @MaxLength(1024, {message: 'Max length of text is 1024'})
  public text!: string;

  @IsNumber({maxDecimalPlaces: 1},{message: 'Rating must be valid float'})
  @Min(1.0, {message: 'Minimum rating value is 1.0'})
  @Max(5.0, {message: 'Maximum rating value is 5.0'})
  public rating!: number;

  @IsMongoId({message: 'offerId field must be a valid id'})
  public offerId!: string;

  @IsMongoId({message: 'authorId field must be a valid id'})
  public authorId!: string;
}
