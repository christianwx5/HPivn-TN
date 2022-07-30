import { subject } from '@casl/ability';
import {
  Body,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';

import { CheckPermissions } from 'src/auth/decorators';
import { Actions, Resources, UsersRoles } from 'src/auth/enums';
import { CaslAbilityFactory } from 'src/auth/factories';
import { AttributesGuard, JwtAuthGuard } from 'src/auth/guards';
import { IConditions } from 'src/interfaces';
import { ParseObjectIdPipe } from 'src/pipes';
import { CompaniesService } from './companies.service';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto';

@Controller({ version: '1', path: 'companies' })
export class CompaniesController {
  constructor(
    private readonly companyService: CompaniesService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() company: CreateCompanyDTO, @Request() req: any) {
    const {
      user: { userId },
    } = req;

    const ability = await this.abilityFactory.createForUser(req.user);

    const conditions: IConditions = {};
    conditions.role = req.user.role;

    if (ability.can(Actions.CREATE, subject(Resources.COMPANIES, conditions))) {
      const newReg = await this.companyService.create(company, userId);
      if (newReg) {
        return {
          status: 'OK',
          message: 'Empresa parametrizada satisfactoriamente',
          data: newReg,
        };
      }
    }

    throw new ForbiddenException('No tienes acceso a este recurso');
  }

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.READ_ALL, Resources.COMPANIES])
  @Get()
  async findAll(
    @Query('name', new DefaultValuePipe('')) name = '',
    @Query('identity', new DefaultValuePipe('')) identification = '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort', new DefaultValuePipe(-1), ParseIntPipe) sort = -1,
  ) {
    const companies = await this.companyService.findAll(
      { name, identification },
      { page, limit, sort: { _id: sort } },
    );

    if (companies) {
      return {
        status: 'OK',
        message: 'Listado de empresas parametrizadas',
        data: companies,
      };
    }
  }

  // get company by id
  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.READ, Resources.COMPANIES])
  @Get(':id')
  async getCompanyById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const company = await this.companyService.getCompanyById(id);
    if (company) {
      return {
        status: 'OK',
        message: 'Empresa encontrada',
        data: company,
      };
    }
  }

  // update company
  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.UPDATE, Resources.COMPANIES])
  @Patch(':id')
  async updateCompanyById(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() updateCompany: UpdateCompanyDTO,
    @Request() req: any,
  ) {
    const {
      user: { userId },
    } = req;

    const company = await this.companyService.update(id, updateCompany, userId);

    if (company) {
      return {
        status: 'OK',
        message: 'Empresa actualizada satisfactoriamente',
        data: company,
      };
    }
  }

  // deactivate company by id "delete for not superadmin user"
  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.DELETE, Resources.COMPANIES])
  @Patch('deactivate/:id')
  async deleteCompanyById(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Request() req: any,
  ) {
    const {
      user: { userId },
    } = req;

    const company = await this.companyService.deactivate(id, userId);

    if (company) {
      return {
        status: 'OK',
        message: 'Empresa desactivada satisfactoriamente',
        data: company,
      };
    }
  }

  // activate company by id
  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.UPDATE, Resources.COMPANIES])
  @Patch('activate/:id')
  async activeCompany(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Request() req: any,
  ) {
    const {
      user: { userId },
    } = req;

    const company = await this.companyService.activate(id, userId);

    if (company) {
      return {
        status: 'OK',
        message: 'Empresa activada satisfactoriamente',
        data: company,
      };
    }
  }

  // remove company from db
  @UseGuards(JwtAuthGuard, AttributesGuard)
  @Delete(':id')
  async removeCompany(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Request() req: any,
  ) {
    const ability = await this.abilityFactory.createForUser(req.user);

    const conditions: IConditions = {};
    conditions.role = UsersRoles.SuperAdmin;

    if (ability.can(Actions.DELETE, subject(Resources.COMPANIES, conditions))) {
      const company = await this.companyService.delete(id);

      if (company) {
        return {
          status: 'OK',
          message: 'Empresa eliminada satisfactoriamente',
          data: id,
        };
      } else {
        return {
          status: 'OK',
          message:
            'La empresa que intenta eliminar no existe o ya fue removida',
          data: id,
        };
      }
    }

    throw new ForbiddenException('No tienes acceso a este recurso');
  }
}
