import {
  IsString,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  imgURL?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(3)
  cod: string;

  @IsString()
  @MinLength(4)
  description: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  status: boolean;
}
