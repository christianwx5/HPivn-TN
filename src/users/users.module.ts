import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schema/user.schema';
import { DatabaseConfigModule } from 'src/config/database/configuration.module';
import { DatabaseConfigService } from 'src/config/database/configuration.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        imports: [DatabaseConfigModule],
        useFactory: async () => {
          const schema = UserSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
        inject: [DatabaseConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [MongooseModule, UsersService],
})
export class UsersModule {}
