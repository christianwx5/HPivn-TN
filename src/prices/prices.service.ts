import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId, PaginateModel, PaginateResult } from 'mongoose';

import { IPaginationOptions, IPaginationQuery } from 'src/interfaces';
import { queriesFilter } from 'src/libs';
import { CreatePriceListDTO, UpdatePriceListDTO } from './dto';
import { Price, PriceDocument } from './schema/price.schema';

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Price.name) private priceModel: PaginateModel<PriceDocument>,
  ) {}

  async create(
    companyId: ObjectId,
    priceList: CreatePriceListDTO,
    userId: ObjectId,
  ): Promise<PriceDocument> {
    try {
      const exists = await this.priceModel
        .find({
          companyId,
          name: priceList.name,
        })
        .count();

      if (exists > 0) throw new ConflictException();

      const newPriceList = new this.priceModel({
        ...priceList,
        companyId,
        createdBy: userId,
        updatedBy: userId,
      });
      return newPriceList.save();
    } catch (error) {
      if (error.status === 409)
        throw new ConflictException(
          'Ya existe una lista de precio con ese nombre',
        );

      throw new InternalServerErrorException(error);
    }
  }

  async findAll(
    queries: IPaginationQuery,
    options: IPaginationOptions,
  ): Promise<PaginateResult<PriceDocument>> {
    try {
      if (queries.name) queries.name = RegExp(queries.name, 'i');

      const query = queriesFilter(queries);

      const newOptions = {
        ...options,
        select: '-__v',
        // populate: {
        //   path: 'companyId',
        //   select: '_id name',
        // },
      };

      const list = await this.priceModel.paginate(query, newOptions);

      if (list.docs.length === 0) throw new NotFoundException();

      return list;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'No se encontraron listas de precios para esta empresa',
        );

      throw new InternalServerErrorException(error);
    }
  }

  async findAllForLoggedUserOrSelectedCompany(
    queries: IPaginationQuery,
    options: IPaginationOptions,
  ): Promise<PaginateResult<PriceDocument>> {
    try {
      if (queries.name) queries.name = RegExp(queries.name, 'i');

      const query = queriesFilter(queries);

      const newOptions = {
        ...options,
        select: '-__v',
      };

      const list = await this.priceModel.paginate(query, newOptions);

      if (list.docs.length === 0) throw new NotFoundException();

      return list;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'No se encontraron listas de precios para esta empresa',
        );

      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(listId: ObjectId): Promise<PriceDocument> {
    try {
      const exists = await this.priceModel.findOne({ _id: listId });
      if (!exists) throw new NotFoundException();

      return exists;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'No se econtró la lista de precios solicitada',
        );

      throw new InternalServerErrorException(error);
    }
  }

  async update(
    listId: ObjectId,
    priceList: UpdatePriceListDTO,
    userId: ObjectId,
  ): Promise<PriceDocument> {
    try {
      const updatedList = await this.priceModel.findByIdAndUpdate(
        listId,
        {
          ...priceList,
          updatedBy: userId,
        },
        { new: true },
      );

      return updatedList;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async activate(listId: ObjectId, userId: ObjectId): Promise<PriceDocument> {
    try {
      const activatedList = await this.priceModel.findByIdAndUpdate(
        listId,
        {
          status: true,
          updatedBy: userId,
        },
        { new: true },
      );

      return activatedList;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deactivate(listId: ObjectId, userId: ObjectId): Promise<PriceDocument> {
    try {
      const deactivatedList = await this.priceModel.findByIdAndUpdate(
        listId,
        {
          status: false,
          updatedBy: userId,
        },
        { new: true },
      );

      return deactivatedList;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: ObjectId): Promise<PriceDocument> {
    try {
      return await this.priceModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
