import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';


import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfigService } from '../config/database/configuration.service';

//import { Utils } from 'src/utils'; 

import { Category, CategorySchema } from './schema/category.schema';
import { DatabaseConfigModule } from 'src/config/database/configuration.module';
// import { Utils } from 'src/utils';

@Module({
  imports: [
    
    MongooseModule.forFeatureAsync([
      {
        name: Category.name,
        imports: [DatabaseConfigModule],
        useFactory: () => {
          const schema = CategorySchema;
          // agregar plugins
          return schema;
        },
        inject: [DatabaseConfigService],
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [MongooseModule, CategoriesService]
})
export class CategoriesModule {}


