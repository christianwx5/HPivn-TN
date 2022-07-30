import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { Currency, CurrencySchema } from './schema/currency.schema';
import { DatabaseConfigModule } from 'src/config/database/configuration.module';
import { DatabaseConfigService } from 'src/config/database/configuration.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Currency.name,
        imports: [DatabaseConfigModule],
        useFactory: async () => {
          const schema = CurrencySchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
        inject: [DatabaseConfigService],
      },
    ]),
  ],
  providers: [CurrenciesService],
  controllers: [CurrenciesController],
  exports: [MongooseModule, CurrenciesService],
})
export class CurrenciesModule {}
