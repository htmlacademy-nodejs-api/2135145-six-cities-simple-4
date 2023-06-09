import { DocumentType } from '@typegoose/typegoose';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import UserLoginDto from './dto/login-user.dto.js';
import UpdateUserDto from './dto/update-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserServiceInterface extends DocumentExistsInterface{
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  exists(documentId: string): Promise<boolean>;
  verifyUser(dro: UserLoginDto, salt: string):Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;

}
