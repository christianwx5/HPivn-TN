import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ObjectId, UpdateWriteOpResult } from 'mongoose';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import { ProductsService } from './products.service';
import { Product } from './schema/product.schema';

@Controller({
  version: '1',
  path: 'products',
})
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async create(
    @Body() productData: CreateProductDTO,
  ): Promise<Product | unknown> {
    const newProduct = await this.productService.create(productData);

    if (newProduct)
      return {
        status: 'OK',
        message: 'Producto registrado satisfactoriamente',
        data: newProduct,
      };
    else
      return {
        status: 'OK',
        message: 'No se logró registrar el produto',
        data: newProduct,
      };
  }

  @Get()
  async findAll(): Promise<Product[] | unknown> {
    const product = await this.productService.findAll();
    if (product.length > 0)
      return {
        status: 'OK',
        message: 'Data de la colección',
        data: product,
      };
    else
      return {
        status: 'OK',
        message: 'No nay data en la colección',
        data: product,
      };
  }

  @Get(':id')
  async findOneById(@Param('id') id: ObjectId): Promise<Product | unknown> {
    const product = await this.productService.findOneById(id);

    if (product)
      return {
        status: 'OK',
        message: 'Se recuperó el producto satisfactoriamente',
        data: product,
      };
    else
      return {
        status: 'OK',
        message: 'No se logró recuperar el produto solicitado',
        data: product,
      };
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: ObjectId,
    @Body() productUpdatedData: UpdateProductDTO,
  ): Promise<UpdateWriteOpResult | unknown> {
    const product = await this.productService.updateOne(id, productUpdatedData);

    if (product)
      return {
        status: 'OK',
        message: 'Se actualizó satisfactoriamente el producto',
        data: product,
      };
    else
      return {
        status: 'OK',
        message: 'No se logró actualizar el produto solicitado',
        data: product,
      };
  }
}
