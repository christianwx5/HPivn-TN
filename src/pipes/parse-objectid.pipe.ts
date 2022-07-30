import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isValidObjectId = Types.ObjectId.isValid(value);

    if (!isValidObjectId) throw new BadRequestException('ObjectId inválido');

    return Types.ObjectId.createFromHexString(value);
  }
}
