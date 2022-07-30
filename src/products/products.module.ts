import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfigModule } from '../config/database/configuration.module';
import { DatabaseConfigService } from '../config/database/configuration.service';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        imports: [DatabaseConfigModule],
        useFactory: () => {
          const schema = ProductSchema;
          // agregar plugins
          return schema;
        },
        inject: [DatabaseConfigService],
      },
    ]),
  ],
  providers: [ProductsService],
  exports: [MongooseModule, ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
