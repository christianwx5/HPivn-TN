import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  DefaultValuePipe,
  UseGuards,
  ParseIntPipe,
  Request,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { subject } from '@casl/ability';

import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/';
import { ParseObjectIdPipe } from 'src/pipes';
import { JwtAuthGuard } from 'src/auth/guards';
import { CheckPermissions } from '../auth/decorators';
import { Actions, Resources, UsersRoles } from 'src/auth/enums';
import { AttributesGuard } from '../auth/guards';
import { CaslAbilityFactory } from 'src/auth/factories';
import { IConditions } from 'src/interfaces';

@Controller({ version: '1', path: 'users' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.READ_ALL, Resources.USERS])
  @Get()
  async findAll(
    @Query('role', new DefaultValuePipe('')) role = '',
    @Query('location', new DefaultValuePipe('')) location = '',
    @Query('email', new DefaultValuePipe('')) email = '',
    @Query('name', new DefaultValuePipe('')) name = '',
    @Query('surname', new DefaultValuePipe('')) surname = '',
    @Query('language', new DefaultValuePipe('')) languages = '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort', new DefaultValuePipe(-1), ParseIntPipe) sort = -1,
  ) {
    const users = await this.usersService.findAll(
      { role, location, email, name, surname, languages },
      { page, limit, sort: { _id: sort } },
    );

    if (users) {
      return {
        status: 'OK',
        message: 'Listado de usuarios en la aplicación',
        data: users,
      };
    }
  }

  @UseGuards(JwtAuthGuard, AttributesGuard)
  @CheckPermissions([Actions.READ, Resources.USERS])
  @Get('self')
  async findLoggedUser(@Request() req: any) {
    const { userId } = req.user;

    const user = await this.usersService.findOneById(userId);

    if (user) {
      return {
        status: 'OK',
        message: 'Usuario encontrado satisfactoriamente',
        data: user,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Request() req: any,
  ) {
    const ability = await this.abilityFactory.createForUser(req.user);

    const conditions: IConditions = {};
    conditions._id = id;

    if (ability.can(Actions.READ, subject(Resources.USERS, conditions))) {
      const user = await this.usersService.findOneById(id);

      if (user) {
        return {
          status: 'OK',
          message: 'Usuario encontrado satisfactoriamente',
          data: user,
        };
      }
    }

    throw new ForbiddenException('No tienes acceso a este recurso');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() data: UpdateUserDTO,
    @Request() req: any,
  ) {
    const ability = await this.abilityFactory.createForUser(req.user);

    const conditions: IConditions = {};
    conditions._id = id;

    // const conditions = { role: 'admin' };
    // console.log(ability.can(Actions.CREATE, subject('users', conditions)));
    // console.log(ability.can(Actions.READ, subject('users', conditions)));
    // console.log(ability.can(Actions.UPDATE, subject('users', conditions)));
    // console.log(ability.can(Actions.DELETE, subject('users', conditions)));

    if (ability.can(Actions.UPDATE, subject(Resources.USERS, conditions))) {
      const user = await this.usersService.update(id, data);
      if (user) {
        return {
          status: 'OK',
          message: 'Usuario actualizado satisfactoriamente',
          data: user,
        };
      }
    }

    throw new ForbiddenException('No tienes acceso a este recurso');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Request() req: any,
  ) {
    const ability = await this.abilityFactory.createForUser(req.user);

    const conditions: IConditions = {};
    conditions.role = UsersRoles.SuperAdmin;

    if (ability.can(Actions.DELETE, subject(Resources.USERS, conditions))) {
      const user = await this.usersService.delete(id);
      if (user) {
        return {
          status: 'OK',
          message: 'Usuario eliminado satisfactoriamente',
          data: id,
        };
      } else {
        return {
          status: 'OK',
          message:
            'El usuario que intenta eliminar no existe o ya fue removido',
          data: id,
        };
      }
    }

    throw new ForbiddenException('No tienes acceso a este recurso');
  }
}
