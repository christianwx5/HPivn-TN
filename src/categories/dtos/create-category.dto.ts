import {
  IsString,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional
} from 'class-validator';

export class CreateCategoryDTO {

  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(4)
  description: string;

  @IsBoolean()
  status: boolean;

  @IsString()
  @IsOptional()
  slug: string;

}
