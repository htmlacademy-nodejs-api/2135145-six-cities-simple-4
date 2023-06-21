import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export default class CreateUserDto {

  @IsString({message: 'Name is required'})
  @MinLength(1, {message: 'Min length of name is 1'})
  @MaxLength(15, {message: 'Max length of name is 15'})
  public name!: string;

  @IsEmail({}, {message: 'Email must be valid address'})
  public email!: string;

  @IsOptional()
  @IsString({message: 'Avatar must be a link to an image'})
  public avatar?: string;

  @IsString({message: 'Password is required'})
  @MinLength(6, {message: 'Min length of password is 6'})
  @MaxLength(12, {message: 'Max length of password is 12'})
  public password!: string;

  @IsBoolean({message: 'isPro is required'})
  public isPro!: boolean;
}
