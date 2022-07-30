import {
  Param,
  Request,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ContactsService } from './contacts.service';
import { CaslAbilityFactory } from '../auth/factories';
import { CreateContactDTO } from './dto';
import { Contact } from './schema/contact.schema';
import { AttributesGuard, JwtAuthGuard } from 'src/auth/guards';
import { CheckPermissions } from 'src/auth/decorators';
import { Actions, Resources } from 'src/auth/enums';
import { Model, ObjectId, UpdateWriteOpResult } from 'mongoose';

@Controller({ version: '1', path: 'contacts' })
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  // @UseGuards(JwtAuthGuard, AttributesGuard)
  // @CheckPermissions([Actions.CREATE, Resources.CONTACTS])
  @Post()
  async create(@Body() contact: CreateContactDTO): Promise<Contact | unknown> {
    const newContact = await this.contactsService.create(contact);

    if (newContact) {
      return {
        status: 'OK',
        message: 'Contacto registrado satisfactoriamente',
        data: contact,
      };
    }
  }

  @Post('/temp')
  async create2(@Body() contact: any): Promise<any> {
    const newContact = await this.contactsService.create2(contact);

    if (newContact) {
      return {
        status: 'OK',
        message: 'Contacto registrado satisfactoriamente',
        data: contact,
      };
    }
  }

  // @UseGuards(JwtAuthGuard, AttributesGuard)
  // @CheckPermissions([Actions.READ_ALL, Resources.CONTACTS])
  @Get()
  async findAll(
    @Query('name', new DefaultValuePipe('')) name = '',
    @Query('surname', new DefaultValuePipe('')) surname = '',
    @Query('email', new DefaultValuePipe('')) email = '',
    @Query('dniNumber', new DefaultValuePipe('')) dniNumber = '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort', new DefaultValuePipe(-1), ParseIntPipe) sort = -1,
  ) {
    const contacts = await this.contactsService.findAll(
      { name, surname, email, dniNumber },
      { page, limit, sort: { _id: sort } },
    );

    if (contacts) {
      return {
        status: 'OK',
        message: 'Listado de contactos en la aplicación',
        data: contacts,
      };
    }else {
      return {
        status: 'OK',
        message: 'No se logró eliminar la categoria',
        data: contacts,
      };
    }
  }

  @Get()
  async findOne() {
    return;
  }

  @Patch()
  async update() {
    return;
  }

  @Patch('activate/:id')
  async activate(
    @Param('id') id: ObjectId,
    @Request() req: any   
  ): Promise<any> {
    // console.log("estas en delete");

    const {
      user: { userId },
    } = req;
    
    const contact = await this.contactsService.activate(id,userId);

    if (contact)
      return {
        status: 'OK',
        message: 'Se activo satisfactoriamente el contacto',
        data: contact,
      };
    else
      return {
        status: 'OK',
        message: 'No se logró activar el contacto',
        data: contact,
      };
  }

  @Patch('deactivate/:id')
  async deactivate(
    @Param('id') id: ObjectId,
    @Request() req: any
  ): Promise<any> {
    // console.log("estas en delete");
    const {
      user: { userId },
    } = req;

    const contact = await this.contactsService.deactivate(id,userId);

    if (contact)
      return {
        status: 'OK',
        message: 'Se desactivo satisfactoriamente el contacto',
        data: contact,
      };
    else
      return {
        status: 'OK',
        message: 'No se logró desactivar el contacto',
        data: contact,
      };
  }

  // @UseGuards(JwtAuthGuard, AttributesGuard)
  // @CheckPermissions([Actions.DELETE, Resources.CONTACTS])
  @Delete(':id')
  async deleteOne(
    @Param('id') id: ObjectId,
  ): Promise<any> {
    // console.log("estas en delete");
    
    const contact = await this.contactsService.deleteOne(id);

    if (contact)
      return {
        status: 'OK',
        message: 'Se elimino satisfactoriamente el contacto',
        data: contact,
      };
    else
      return {
        status: 'OK',
        message: 'No se logró eliminar el contacto',
        data: contact,
      };
  }
}
