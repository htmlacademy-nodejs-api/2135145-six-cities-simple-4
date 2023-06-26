import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { createSHA256 } from '../../core/helpers/common.js';
import { User } from '../../types/user.type.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, minlength: 1, maxlength: 15})
  public name!: string;

  @prop({unique: true, required: true})
  public email!: string;

  @prop()
  public avatar?: string;

  @prop({required: true})
  public password!: string;

  @prop({required: true})
  public isPro!: boolean;

  constructor(userData: User) {
    super();
    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar ?? '';
    this.isPro = userData.isPro;
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
