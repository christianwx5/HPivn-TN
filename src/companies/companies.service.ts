import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId, PaginateModel, PaginateResult } from 'mongoose';

import { ISOCurrency } from 'src/currencies/enums';
import { IPaginationOptions, IPaginationQuery } from 'src/interfaces';
import { queriesFilter } from 'src/libs';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto';
import { Company, CompanyDocument } from './schema/company.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: PaginateModel<CompanyDocument>,
  ) {}

  async create(
    company: CreateCompanyDTO,
    userId: ObjectId,
  ): Promise<CompanyDocument> {
    try {
      const exists = await this.companyModel.findOne({
        identification: company.identification,
      });

      if (exists) throw new ConflictException();

      // check if currency code exists in enum and add properties to currency object
      if (Object.keys(ISOCurrency).includes(company.currency.code)) {
        company.currency.code = Object.keys(ISOCurrency).find(
          (c) => c === company.currency.code,
        );
        company.currency['symbol'] = company.currency.exchangeRate
          .toLocaleString('en', {
            style: 'currency',
            currency: company.currency.code,
          })
          .replace(/\d+([,.]\d+)?/g, '')
          .trim();
      }

      const newCompany = new this.companyModel({
        ...company,
        createdBy: userId,
        updatedBy: userId,
      });

      return newCompany.save();
    } catch (error) {
      if (error.status === 409)
        throw new ConflictException('Esta empresa ya se encuentra registrada');

      throw new InternalServerErrorException(error);
    }
  }

  async findAll(
    queries: IPaginationQuery,
    options: IPaginationOptions,
  ): Promise<PaginateResult<CompanyDocument>> {
    try {
      if (queries.name) queries.name = RegExp(queries.name, 'i');

      const query = queriesFilter(queries);

      const newOptions = {
        ...options,
        select: '-password -refreshToken -__v',
      };

      return await this.companyModel.paginate(query, newOptions);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCompanyById(id: ObjectId): Promise<CompanyDocument> {
    try {
      const company = await this.companyModel.findById(id);
      if (!company) throw new NotFoundException();
      return company;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('Empresa no encontrada');

      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: ObjectId,
    updateCompanies: UpdateCompanyDTO,
    userId: ObjectId,
  ): Promise<CompanyDocument> {
    try {
      const company = await this.companyModel.findByIdAndUpdate(
        id,
        {
          ...updateCompanies,
          updatedBy: userId,
        },
        { new: true },
      );

      return company;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deactivate(id: ObjectId, userId: ObjectId): Promise<CompanyDocument> {
    try {
      const company = await this.companyModel.findByIdAndUpdate(
        id,
        {
          status: false,
          updatedBy: userId,
        },
        { new: true },
      );

      return company;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async activate(id: ObjectId, userId: ObjectId): Promise<CompanyDocument> {
    try {
      return await this.companyModel.findByIdAndUpdate(
        id,
        {
          status: true,
          updatedBy: userId,
        },
        { new: true },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: ObjectId) {
    try {
      const company = await this.companyModel.findByIdAndDelete(id);
      return company;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
