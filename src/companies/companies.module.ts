import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company, CompanySchema } from './schema/company.schema';
import { DatabaseConfigModule } from 'src/config/database/configuration.module';
import { DatabaseConfigService } from 'src/config/database/configuration.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Company.name,
        imports: [DatabaseConfigModule],
        useFactory: async () => {
          const schema = CompanySchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
        inject: [DatabaseConfigService],
      },
    ]),
  ],
  providers: [CompaniesService],
  controllers: [CompaniesController],
  exports: [MongooseModule, CompaniesService],
})
export class CompaniesModule {}
