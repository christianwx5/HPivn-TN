import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { Languages, UsersRoles } from '../../auth/enums';

export class CreateUserDTO {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsEnum(Languages, { each: true })
  @IsOptional()
  language?: Languages;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @MinLength(3)
  location: string;

  @IsEnum(UsersRoles, { each: true })
  role: UsersRoles;

  @IsNotEmpty()
  @IsArray()
  permissions: unknown;

  @IsMongoId()
  @IsOptional()
  companies?: ObjectId;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
