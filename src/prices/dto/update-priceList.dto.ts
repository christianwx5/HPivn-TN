import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePriceListDTO } from './';

export class UpdatePriceListDTO extends PartialType(
  OmitType(CreatePriceListDTO, ['status'] as const),
) {}
