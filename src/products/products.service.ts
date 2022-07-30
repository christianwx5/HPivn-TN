import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, UpdateWriteOpResult } from 'mongoose';
import { CreateProductDTO, UpdateProductDTO } from './dtos';

import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(createProduct: CreateProductDTO): Promise<Product> {
    try {
      const exists = await this.productModel.findOne({
        cod: createProduct.cod,
      });

      if (exists) throw new ConflictException();

      const newProduct = new this.productModel(createProduct);

      await newProduct.save();

      return newProduct;
    } catch (error) {
      if (error.status === 409)
        throw new ConflictException(
          'El código del producto ya se encuentra registrado',
        );

      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return this.productModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneById(id: ObjectId): Promise<Product> {
    try {
      const exists = await this.productModel.findOne({ _id: id }).exec();

      if (!exists) throw new NotFoundException();

      return exists;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'El producto que intenta buscar no se encuentra registrado.',
        );
      throw new InternalServerErrorException(error);
    }
  }

  async updateOne(
    id: ObjectId,
    updateProduct: UpdateProductDTO,
  ): Promise<UpdateWriteOpResult> {
    try {
      const exists = await this.productModel.findById(id).count();

      if (exists === 0) throw new NotFoundException();

      return await this.productModel.updateOne({ _id: id }, updateProduct);
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(
          'El producto que intenta actualizar no se encuentra registrado.',
        );
      throw new InternalServerErrorException(error);
    }
  }
}
