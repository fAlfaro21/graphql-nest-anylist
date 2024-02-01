import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([ User ]) //Para que podamos mirar la tabla físicamente en tabalePlus
  ],
  exports: [
    //TypeOrmModule,   -> en el caso de que alguien quisiera utilizar el users entity o repository
    UsersService
  ]
})
export class UsersModule {}
