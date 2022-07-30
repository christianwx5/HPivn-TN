import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Delete,
  UseGuards,
  Request } from '@nestjs/common';
import { ObjectId, UpdateWriteOpResult } from 'mongoose';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos';
import { CategoriesService } from './categories.service';
import { Category } from './schema/category.schema';
import { AttributesGuard, JwtAuthGuard } from 'src/auth/guards';
import { CheckPermissions } from 'src/auth/decorators';
// import { CheckPermissions } from '../auth/decorators'; /* <--- tambien se puede importar asi */
import { Actions, Resources } from 'src/auth/enums';


@Controller({
    version: '1',
    path: 'categories',
  })
export class CategoriesController {

    constructor(private readonly categoryService: CategoriesService) {}

    @UseGuards(JwtAuthGuard, AttributesGuard)
    @CheckPermissions([Actions.READ_ALL, Resources.CATEGORIES])
    @Get()
    async findAll(): Promise<Category[] | unknown> {
      const category = await this.categoryService.findAll();
      if (category.length > 0)
        return {
          status: 'OK',
          message: 'Data de la colección',
          data: category,
        };
      else
        return {
          status: 'OK',
          message: 'No nay data en la colección',
          data: category,
        };
    }

    @UseGuards(JwtAuthGuard, AttributesGuard)//Esta linea de comando
    @CheckPermissions([Actions.CREATE, Resources.CATEGORIES])
    @Post()
    async create(
      @Body() categoryData: CreateCategoryDTO,
      @Request() req: any, //me permite usar esto, el cual trae el token
    ): Promise<Category | unknown> {
      
      // console.log(req.user.userId);
      
      const newCategory = await this.categoryService.create(categoryData, req.user.userId);
  
      if (newCategory)
        return {
          status: 'OK',
          message: 'Categoria registrada satisfactoriamente',
          data: newCategory,
        };
      else
        return {
          status: 'OK',
          message: 'No se logró registrar la categoria',
          data: newCategory,
        };
    }

    @UseGuards(JwtAuthGuard, AttributesGuard)
    @CheckPermissions([Actions.READ, Resources.CATEGORIES])
    @Get(':id')
    async findOneById(@Param('id') id: ObjectId): Promise<Category | unknown> {
      const category = await this.categoryService.findOneById(id);
  
      if (category)
        return {
          status: 'OK',
          message: 'Se recuperó el categoryo satisfactoriamente',
          data: category,
        };
      else
        return {
          status: 'OK',
          message: 'No se logró recuperar el produto solicitado',
          data: category,
        };
    }
  
    @UseGuards(JwtAuthGuard, AttributesGuard)//Esta linea de comando
    @CheckPermissions([Actions.UPDATE, Resources.CATEGORIES])
    @Patch(':id')
    async updateOne(
      @Param('id') id: ObjectId,
      @Body() categoryUpdatedData: UpdateCategoryDTO,
      @Request() req: any, //me permite usar esto, el cual trae el token
    ): Promise<UpdateWriteOpResult | unknown> {
      const category = await this.categoryService.updateOne(id, categoryUpdatedData, req.user.userId);
  
      if (category)
        return {
          status: 'OK',
          message: 'Se actualizó satisfactoriamente el categoryo',
          data: category,
        };
      else
        return {
          status: 'OK',
          message: 'No se logró actualizar el produto solicitado',
          data: category,
        };
    }

    @UseGuards(JwtAuthGuard, AttributesGuard)
    @CheckPermissions([Actions.DELETE, Resources.CATEGORIES])
    @Delete(':id')
    async deleteOne(
      @Param('id') id: ObjectId,
    ): Promise<UpdateWriteOpResult | unknown> {
      // console.log("estas en delete");
      
      const category = await this.categoryService.deleteOne(id);
  
      if (category)
        return {
          status: 'OK',
          message: 'Se elimino satisfactoriamente la categoria',
          data: category,
        };
      else
        return {
          status: 'OK',
          message: 'No se logró eliminar la categoria',
          data: category,
        };
    }
}
