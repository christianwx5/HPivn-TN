import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId, PaginateModel, PaginateResult } from 'mongoose';

import { Currency, CurrencyDocument } from './schema/currency.schema';
import { CreateCurrencyDTO, UpdateCurrencyDTO } from './dto';
import { ISOCurrency } from './enums';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectModel(Currency.name)
    private currencyModel: PaginateModel<CurrencyDocument>,
  ) {}

  async getCurrencyById(id: ObjectId): Promise<CurrencyDocument> {
    try {
      const currency = await this.currencyModel.findById(id);

      if (!currency) throw new NotFoundException();

      return currency;
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(`No se encontro la moneda ${id}`);
      }

      throw new InternalServerErrorException(error);
    }
  }

  async getCurrenciesByCompanyId(
    id: ObjectId,
  ): Promise<PaginateResult<CurrencyDocument>> {
    try {
      const currencies = await this.currencyModel.paginate({
        companyId: id,
      });

      if (currencies.docs.length > 0) {
        return currencies;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(
          `No se encontraron monedas para esta empresa ${id}`,
        );
      }
      throw new InternalServerErrorException(error);
    }
  }

  async create(
    companyId: ObjectId,
    currency: CreateCurrencyDTO,
    userId: ObjectId,
  ): Promise<CurrencyDocument> {
    // check if currency code exists in enum and add properties to currency object
    if (Object.keys(ISOCurrency).includes(currency.code)) {
      currency['code'] = Object.keys(ISOCurrency).find(
        (c) => c === currency.code,
      );
      currency['name'] = ISOCurrency[currency.code];
      currency['symbol'] = currency.exchangeRate
        .toLocaleString('en', { style: 'currency', currency: currency.code })
        .replace(/\d+([,.]\d+)?/g, '')
        .trim();
    }

    try {
      const exists = await this.currencyModel
        .find({
          companyId,
          code: currency.code,
        })
        .count();

      if (exists > 0) throw new ConflictException();

      const newCurrency = new this.currencyModel({
        ...currency,
        companyId,
        createdBy: userId,
        updatedBy: userId,
      });

      return newCurrency.save();
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException('Esta moneda ya se encuentra registrada');
      }

      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: ObjectId,
    currency: UpdateCurrencyDTO,
    userId: ObjectId,
  ): Promise<CurrencyDocument> {
    try {
      const updatedCurreny = await this.currencyModel.findByIdAndUpdate(
        id,
        {
          ...currency,
          updatedBy: userId,
        },
        { new: true },
      );

      return updatedCurreny;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async activate(id: ObjectId, userId: ObjectId) {
    try {
      const activateCurrency = await this.currencyModel.findByIdAndUpdate(
        id,
        {
          status: true,
          updatedBy: userId,
        },
        { new: true },
      );
      return activateCurrency;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deactivate(id: ObjectId, userId: ObjectId) {
    try {
      const deactivateCurrency = await this.currencyModel.findByIdAndUpdate(
        id,
        {
          status: false,
          updatedBy: userId,
        },
        { new: true },
      );
      return deactivateCurrency;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id) {
    try {
      const deletedCurrency = await this.currencyModel.findByIdAndDelete(id);
      return deletedCurrency;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
