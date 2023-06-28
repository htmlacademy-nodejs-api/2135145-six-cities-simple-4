import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import CreateUserDto from './dto/create-user.dto.js';
import UserLoginDto from './dto/login-user.dto.js';
import UpdateUserDto from './dto/update-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.const.js';
import { UserEntity } from './user.entity.js';

@injectable()
export default class UserService implements UserServiceInterface {

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);
    const result = await this.userModel.create(user);

    this.logger.info(`New user created: ${result}`);
    return result;
  }

  public async findByEmail(email:string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existingUser = await this.findByEmail(dto.email);

    if(existingUser){
      return existingUser;
    }

    return this.create(dto, salt);
  }

  public async exists(documentId: string) {
    return (await this.userModel
      .exists({_id: documentId})) !== null;
  }

  public async verifyUser(dto: UserLoginDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if(!user) {
      return null;
    }

    if(user.verifyPassword(dto.password, salt)){
      return user;
    }

    return null;
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }
}
