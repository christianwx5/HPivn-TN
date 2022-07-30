import { subject } from '@casl/ability';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';

import { Actions, Resources } from 'src/auth/enums';
import { CaslAbilityFactory } from 'src/auth/factories';
import { JwtAuthGuard } from 'src/auth/guards';
import { IConditions } from 'src/interfaces';
import { ParseObjectIdPipe } from 'src/pipes';
import { CreatePriceListDTO, UpdatePriceListDTO } from './dto';
import { PricesService } from './prices.service';

@Controller({ version: '1', path: 'prices' })
export class PricesController {
  constructor(
    private readonly pricesService: PricesService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':companyId')
  async create(
    @Param('companyId', ParseObjectIdPipe) companyId: ObjectId,
    @Body() priceList: CreatePriceListDTO,
    @Request() req: any,
  ) {
    const {
      user: { userId },
    } = req;

    const ability = await this.abilityFactory.createForUser(req.user);

    const conditions: IConditions = {};
    conditions.role = req.user.role;

    if (
      ability.can(Actions.CREATE, subject(Resources.PRICE_LIST, conditions))
    ) {
      const list = await this.pricesService.create(
        companyId,
        priceList,
        userId,
      );

      if (list) {
        return {
          status: 'OK',
          message: 'Se creo la lista de precios satisfactoriamente',
          data: list,
        };
      }
    }

    throw new ForbiddenException('No tienes acceso a este recurso');
  }

  @UseGuards(JwtAuthGuard)
  @Post('self')
  async createOwnPriceList(
    @Body() priceList: CreatePriceListDTO,
    @Request() req: any,
  ) {
    const {
      user: { userId, companies },
    } = req;

    const list = await this.pricesService.create(companies, priceList, userId);

    if (list) {
      return {
        status: 'OK',
        message: 'Se creo la lista de precios satisfactoriamente',
        data: list,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('name', new DefaultValuePipe('')) name = '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort', new DefaultValuePipe(-1), ParseIntPipe) sort = -1,
  ) {
    const list = await this.pricesService.findAll(
      { name },
      { page, limit, sort: { _id: sort } },
    );

    if (list) {
      return {
        status: 'OK',
        message: 'Listas de precios registradas en la aplicación',
        data: list,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('self')
  async findAllForLoggedUser(
    @Query('name', new DefaultValuePipe('')) name = '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort', new DefaultValuePipe(-1), ParseIntPipe) sort = -1,
    @Request() req: any,
  ) {
    const {
      user: { companies },
    } = req;

    const list = await this.pricesService.findAllForLoggedUserOrSelectedCompany(
      { name, companyId: companies },
      { page, limit, sort: { _id: sort } },
    );

    if (list) {
      return {
        status: 'OK',
        message: `Listas de precios para la empresa`,
        data: list,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('company/:id')
  async findAllForSelectedCompany(
    @Query('name', new DefaultValuePipe('')) name = '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort', new DefaultValuePipe(-1), ParseIntPipe) sort = -1,
    @Param('id', ParseObjectIdPipe) companyId: ObjectId,
  ) {
    const list = await this.pricesService.findAllForLoggedUserOrSelectedCompany(
      { name, companyId },
      { page, limit, sort: { _id: sort } },
    );

    if (list) {
      return {
        status: 'OK',
        message: `Listas de precios para la empresa`,
        data: list,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':listId')
  async findOneById(@Param('listId', ParseObjectIdPipe) listId: ObjectId) {
    const list = await this.pricesService.findOneById(listId);

    if (list) {
      return {
        status: 'OK',
        message: 'Lista de precios encontrada satisfactoriamente',
        data: list,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) listId: ObjectId,
    @Body() priceList: UpdatePriceListDTO,
    @Request() req: any,
  ) {
    const { userId } = req.user;

    const updatedList = await this.pricesService.update(
      listId,
      priceList,
      userId,
    );

    if (updatedList) {
      return {
        status: 'OK',
        message: 'Lista de precios actualizada satisfactoriamente',
        data: updatedList,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('activate/:id')
  async activate(
    @Param('id', ParseObjectIdPipe) listId: ObjectId,
    @Request() req: any,
  ) {
    const { userId } = req.user;

    const activatedList = await this.pricesService.activate(listId, userId);

    if (activatedList) {
      return {
        status: 'OK',
        message: 'Lista de precios activada satisfactoriamente',
        data: activatedList,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('deactivate/:id')
  async deactivate(
    @Param('id', ParseObjectIdPipe) listId: ObjectId,
    @Request() req: any,
  ) {
    const { userId } = req.user;

    const deactivatedList = await this.pricesService.deactivate(listId, userId);

    if (deactivatedList) {
      return {
        status: 'OK',
        message: 'Lista de precios desactivada satisfactoriamente',
        data: deactivatedList,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseObjectIdPipe) listId: ObjectId,
    @Request() req: any,
  ) {
    const ability = await this.abilityFactory.createForUser(req.user);

    const conditions: IConditions = {};
    conditions.role = req.user.role;

    if (
      ability.can(Actions.DELETE, subject(Resources.PRICE_LIST, conditions))
    ) {
      const removedList = await this.pricesService.delete(listId);

      if (removedList) {
        return {
          status: 'OK',
          message: 'Lista de precios eliminada satisfactoriamente',
        };
      }
    }

    throw new ForbiddenException('No tienes acceso a este recurso');
  }
}
