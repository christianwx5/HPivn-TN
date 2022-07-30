import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateContactDTO } from './';

export class UpdateContactDTO extends PartialType(
  OmitType(CreateContactDTO, ['status'] as const),
) {}
