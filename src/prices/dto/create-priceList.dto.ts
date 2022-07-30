import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PriceType } from '../enums';

export class CreatePriceListDTO {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEnum(PriceType, { each: true })
  classification: PriceType;

  @IsNumber()
  @IsOptional()
  percentage?: number;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
