import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel,  PaginateResult, ObjectId, UpdateWriteOpResult} from 'mongoose';

import { Contact, ContactDocument } from './schema/contact.schema';
import { CreateContactDTO } from './dto/create-contact.dto';
import { IPaginationOptions, IPaginationQuery } from 'src/interfaces';
import { queriesFilter, renameKey } from 'src/libs';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name)
    private contactModel: PaginateModel<ContactDocument>,
  ) {}

  async create(contact: CreateContactDTO): Promise<ContactDocument> {
    try {
      const exists = await this.contactModel
        .findOne({
          'dni.number': contact.dni.number,
        })
        .count();

      if (exists === 1) throw new ConflictException();

      const newContact = new this.contactModel(contact);

      return newContact.save();
    } catch (error) {
      if (error.status === 409)
        throw new ConflictException(
          'Ya existe este registro en la base de datos',
        );

      throw new InternalServerErrorException(error);
    }
  }

  async create2(contact: any): Promise<any> {
    try {
      

      

      const newContact = new this.contactModel(contact);

      return newContact.save();
    } catch (error) {
      if (error.status === 409)
        throw new ConflictException(
          'Ya existe este registro en la base de datos',
        );

      throw new InternalServerErrorException(error);
    }
  }

  async findAll(
    queries: IPaginationQuery,
    options: IPaginationOptions,
  ): Promise<PaginateResult<ContactDocument>> {
    try {
      if (queries.name) queries.name = RegExp(queries.name, 'i');
      if (queries.surname) queries.surname = RegExp(queries.surname, 'i');

      let query = queriesFilter(queries);

      if (query.dniNumber) {
        query = renameKey(query, 'dniNumber', 'dni.number');
      }

      const newOptions = {
        ...options,
        select: '-__v',
      };

      return await this.contactModel.paginate(query, newOptions);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne() {
    return;
  }

  async update() {
    return;
  }

  async activate(
    id: ObjectId,
    userId: ObjectId
  ): Promise<any>  {
    try {
      const exists = await this.contactModel.findById(id).count();
      
      console.log("exists: "+exists);
      
      if (exists === 0) throw new NotFoundException();

      return await this.contactModel.findByIdAndUpdate(
        id,
        {
          status: true,
          updatedBy: userId,
        }
      );

    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'Ha ocurrido un error al intentar activar.',
        );
      throw new InternalServerErrorException(error);
    }
  }

  async deactivate(
    id: ObjectId,
    userId: ObjectId
  ): Promise<any> {
    try {
      const exists = await this.contactModel.findById(id).count();
      
      console.log("exists: "+exists);
      
      if (exists === 0) throw new NotFoundException();

      return await this.contactModel.findByIdAndUpdate(
        id,
        {
          status: false,
          updatedBy: userId,
        }
      );

    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'Ha ocurrido un error al intentar desactivar.',
        );
      throw new InternalServerErrorException(error);
    }
  }

//   async delete() {
//     return;
//   }

  async deleteOne(
    id: ObjectId
  ): Promise<any> {
    try {
      const exists = await this.contactModel.findById(id).count();
      
      console.log("exists: "+exists);
      
      if (exists === 0) throw new NotFoundException();

      return await this.contactModel.findByIdAndDelete(id);

    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'El contacto se ha eliminado correctamente.',
        );
      throw new InternalServerErrorException(error);
    }
  }
}

