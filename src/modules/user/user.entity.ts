import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { createSHA256 } from '../../core/helpers/common.js';
import { UserType } from '../../types/user-type.enum.js';
import { User } from '../../types/user.type.js';
import { NameLength } from './user.const.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, minlength: NameLength.MIN, maxlength: NameLength.MAX})
  public name!: string;

  @prop({unique: true, required: true})
  public email!: string;

  @prop()
  public avatar?: string;

  @prop({required: true})
  public password!: string;

  @prop({
    required: true,
    enum: UserType,
    type: () => String,
  })
  public type!: UserType;

  constructor(userData: User) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar ?? '';
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
