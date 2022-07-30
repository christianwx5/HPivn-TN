import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { subject } from '@casl/ability';

import { CurrenciesService } from './currencies.service';
import { CaslAbilityFactory } from '../auth/factories/casl-ability.factory';
import { CreateCurrencyDTO, UpdateCurrencyDTO } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPermissions } from '../auth/decorators/attributes.decorator';
import { Actions, Resources } from 'src/auth/enums';
import { ParseObjectIdPipe } from 'src/pipes';
import { AttributesGuard } from 'src/auth/guards';
import { IConditions } from 'src/interfaces';

@Controller({ version: '1', path: 'currencies' })
export class CurrenciesController {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.CREATE, Resources.CURRENCIES])
  @Post(':companyId')
  async create(
    @Param('companyId', ParseObjectIdPipe) companyId: ObjectId,
    @Body() currency: CreateCurrencyDTO,
    @Request() req: any,
  ) {
    const {
      user: { userId },
    } = req;

    const newCurrency = await this.currenciesService.create(
      companyId,
      currency,
      userId,
    );

    return {
      status: 'OK',
      message: 'Moneda registrada satisfactoriamente',
      data: newCurrency,
    };
  }

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.CREATE, Resources.CURRENCIES])
  @Post('self')
  async createOwnCurrency(
    @Body() currency: CreateCurrencyDTO,
    @Request() req: any,
  ) {
    const {
      user: { userId, companies },
    } = req;

    const newCurrency = await this.currenciesService.create(
      companies,
      currency,
      userId,
    );

    return {
      status: 'OK',
      message: 'Moneda registrada satisfactoriamente',
      data: newCurrency,
    };
  }

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.READ, Resources.CURRENCIES])
  @Get(':id')
  async getCurrencyById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const currency = await this.currenciesService.getCurrencyById(id);

    return {
      status: 'OK',
      message: 'Moneda encontrada satisfactoriamente',
      data: currency,
    };
  }

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.READ_ALL, Resources.CURRENCIES])
  @Get('company/:id')
  async getCurrenciesByCompanyId(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const currencies = await this.currenciesService.getCurrenciesByCompanyId(
      id,
    );

    return {
      status: 'OK',
      message: 'Monedas encontradas satisfactoriamente para la empresa',
      data: currencies,
    };
  }

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.UPDATE, Resources.CURRENCIES])
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() currency: UpdateCurrencyDTO,
    @Request() req: any,
  ) {
    const {
      user: { userId },
    } = req;

    const updatedCurrency = await this.currenciesService.update(
      id,
      currency,
      userId,
    );

    return {
      status: 'OK',
      message: 'Moneda actualizada satisfactoriamente',
      data: updatedCurrency,
    };
  }

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.UPDATE, Resources.CURRENCIES])
  @Patch('deactivate/:id')
  async deactivate(
    @Param('id', ParseObjectIdPipe) currencyId: ObjectId,
    @Request() req: any,
  ) {
    const {
      user: { userId },
    } = req;

    const updatedCurrency = await this.currenciesService.deactivate(
      currencyId,
      userId,
    );

    return {
      status: 'OK',
      message: 'Moneda desactivada satisfactoriamente',
      data: updatedCurrency,
    };
  }

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.UPDATE, Resources.CURRENCIES])
  @Patch('activate/:id')
  async activate(
    @Param('id', ParseObjectIdPipe) currencyId: ObjectId,
    @Request() req: any,
  ) {
    const {
      user: { userId },
    } = req;

    const updatedCurrency = await this.currenciesService.activate(
      currencyId,
      userId,
    );

    return {
      status: 'OK',
      message: 'Moneda activada satisfactoriamente',
      data: updatedCurrency,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Request() req: any,
  ) {
    const ability = await this.abilityFactory.createForUser(req.user);

    const conditions: IConditions = {};
    conditions.role = req.user.role;

    if (
      ability.can(Actions.DELETE, subject(Resources.CURRENCIES, conditions))
    ) {
      const currency = await this.currenciesService.delete(id);

      if (currency) {
        return {
          status: 'OK',
          message: 'Moneda eliminada satisfactoriamente',
        };
      }
    }

    throw new ForbiddenException('No tienes acceso a este recurso');
  }
}
