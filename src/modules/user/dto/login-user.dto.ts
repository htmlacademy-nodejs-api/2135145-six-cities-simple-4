import { IsEmail, IsString } from 'class-validator';

export default class UserLoginDto {
  @IsEmail({}, {message: 'Email must be valid address'})
  public email!: string;

  @IsString({message: 'Password is required'})
  public password!: string;
}
