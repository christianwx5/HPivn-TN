import { IsNumber, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ISOCurrencyCode } from '../enums';

export class CreateCurrencyDTO {
  @IsEnum(ISOCurrencyCode, { each: true })
  code: string;

  @IsNumber()
  exchangeRate: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
