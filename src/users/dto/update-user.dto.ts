import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './';

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, ['email'] as const),
) {}
