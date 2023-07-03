import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../../../types/user-type.enum.js';
import { NameLength, PasswordLength } from '../user.const.js';

export default class CreateUserDto {

  @IsString({message: 'Name is required'})
  @MinLength(NameLength.MIN, {message: `Min length of name is ${NameLength.MIN}`})
  @MaxLength(NameLength.MAX, {message: `Max length of name is ${NameLength.MAX}`})
  public name!: string;

  @IsEmail({}, {message: 'Email must be valid address'})
  public email!: string;

  @IsString({message: 'Password is required'})
  @MinLength(PasswordLength.MIN, {message: `Min length of password is ${PasswordLength.MIN}`})
  @MaxLength(PasswordLength.MAX, {message: `Max length of password is ${PasswordLength.MAX}`})
  public password!: string;

  @IsEnum(UserType, {message: 'Must be one of Goods'})
  public type!: UserType;
}
