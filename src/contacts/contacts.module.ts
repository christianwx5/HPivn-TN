import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { Contact, ContactSchema } from './schema/contact.schema';
import { DatabaseConfigModule } from '../config/database/configuration.module';
import { DatabaseConfigService } from '../config/database/configuration.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Contact.name,
        imports: [DatabaseConfigModule],
        useFactory: async () => {
          const schema = ContactSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
        inject: [DatabaseConfigService],
      },
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [MongooseModule, ContactsService],
})
export class ContactsModule {}
