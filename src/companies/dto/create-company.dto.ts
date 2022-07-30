import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ISOCurrencyCode } from 'src/currencies/enums';
import { Plans } from '../enums/plans.enum';
import { Timezones } from '../enums/timezones.enum';

class CurrencyDTO {
  @IsEnum(ISOCurrencyCode, { each: true })
  code: string;

  @IsNumber()
  exchangeRate: number;
}

class AddressDTO {
  @IsString()
  province: string;

  @IsString()
  city: string;

  @IsString()
  zipCode: string;

  @IsString()
  address: string;
}

class InvoicePreferencesDTO {
  @IsString()
  defaultAnnotation: string;

  @IsString()
  defaultTermsAndConditions: string;
}

class LegalRepresentative {
  @IsString()
  firstname: string;

  @IsString()
  lastname: ScrollSetting;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}

export class CreateCompanyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  identification: string;

  @IsPhoneNumber()
  phone: string;

  @IsPhoneNumber()
  @IsOptional()
  fax?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  regime?: string;

  @IsNotEmptyObject()
  currency: CurrencyDTO;

  @IsBoolean()
  multiCurrency: boolean;

  @IsNumber()
  decimalPrecision: number;

  @IsNotEmptyObject()
  address: AddressDTO;

  @IsNotEmptyObject()
  invoicePreferences: InvoicePreferencesDTO;

  @IsString()
  initialInvoiceNumber: string;

  @IsEnum(Plans, { each: true })
  planType: string;

  @IsNotEmptyObject()
  legalRepresentative: LegalRepresentative;

  @IsBoolean()
  isOpen: boolean;

  @IsString()
  workingTime: string;

  @IsString()
  specialWorkingTime: string;

  @IsUrl()
  logo: string;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  slogan: string;

  @IsString()
  @MinLength(5)
  @MaxLength(300)
  description: string;

  @IsString()
  @MinLength(3)
  applicationVersion: string;

  @IsEnum(Timezones, { each: true })
  timezone: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
