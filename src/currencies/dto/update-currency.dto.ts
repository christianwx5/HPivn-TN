import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCurrencyDTO } from './create-currency.dto';

export class UpdateCurrencyDTO extends PartialType(
  OmitType(CreateCurrencyDTO, ['status'] as const),
) {}
