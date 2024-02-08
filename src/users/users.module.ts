import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { ListsModule } from 'src/lists/lists.module';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([ User ]), //Para que podamos mirar la tabla físicamente en tabalePlus
    ItemsModule,
    ListsModule
  ],
  exports: [
    TypeOrmModule,   //-> para poder utilizar/inyectar el user entity o el repository
    UsersService
  ]
})
export class UsersModule {}
