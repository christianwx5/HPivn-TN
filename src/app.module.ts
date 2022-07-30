import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfigModule } from './config/database/configuration.module';
import { DatabaseConfigService } from './config/database/configuration.service';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ProductsModule } from './products/products.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { PricesModule } from './prices/prices.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: async (dbService: DatabaseConfigService) => ({
        uri: dbService.uri,
      }),
      inject: [DatabaseConfigService],
    }),
    AuthModule,
    CompaniesModule,
    ProductsModule,
    CurrenciesModule,
    PricesModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
