import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { Price, PriceSchema } from './schema/price.schema';
import { DatabaseConfigModule } from 'src/config/database/configuration.module';
import { DatabaseConfigService } from 'src/config/database/configuration.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Price.name,
        imports: [DatabaseConfigModule],
        useFactory: async () => {
          const schema = PriceSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
        inject: [DatabaseConfigService],
      },
    ]),
  ],
  providers: [PricesService],
  controllers: [PricesController],
  exports: [MongooseModule, PricesService],
})
export class PricesModule {}
