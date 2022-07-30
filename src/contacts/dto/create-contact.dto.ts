import { ContactsRoles } from '../../auth/enums/roles/users-roles.enum';
import { Contributors } from '../enums/contributors.enum';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DniDTO {
  @IsString()
  type: string;

  @IsString()
  number: string;
}

export class CreateContactDTO {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  surname: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DniDTO)
  dni: DniDTO;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  primaryPhone?: string;

  @IsPhoneNumber()
  @IsOptional()
  secondaryPhone?: string;

  @IsMobilePhone()
  @IsOptional()
  mobilePhone: string;

  @IsPhoneNumber()
  @IsOptional()
  fax: string;

  @IsString()
  @IsOptional()
  details: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsEnum(ContactsRoles, { each: true })
  type: ContactsRoles[];

  @IsString()
  @IsOptional()
  referredBy: string;

  @IsEnum(Contributors, { each: true })
  representation: Contributors;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
