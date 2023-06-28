import { IsBoolean, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { MAX_NAME_LENGTH, MAX_PASSWORD_LENGTH, MIN_NAME_LENGTH, MIN_PASSWORD_LENGTH } from '../user.const.js';

export default class CreateUserDto {

  @IsString({message: 'Name is required'})
  @MinLength(MIN_NAME_LENGTH, {message: `Min length of name is ${MIN_NAME_LENGTH}`})
  @MaxLength(MAX_NAME_LENGTH, {message: `Max length of name is ${MAX_NAME_LENGTH}`})
  public name!: string;

  @IsEmail({}, {message: 'Email must be valid address'})
  public email!: string;

  @IsString({message: 'Password is required'})
  @MinLength(MIN_PASSWORD_LENGTH, {message: `Min length of password is ${MIN_PASSWORD_LENGTH}`})
  @MaxLength(MAX_PASSWORD_LENGTH, {message: `Max length of password is ${MAX_PASSWORD_LENGTH}`})
  public password!: string;

  @IsBoolean({message: 'isPro is required'})
  public isPro!: boolean;
}
