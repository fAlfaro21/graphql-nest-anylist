import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { ListItemModule } from '../list-item/list-item.module';
import { List } from './entities/list.entity';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [
    TypeOrmModule.forFeature([ List ]),//Vincula la entidad con la base de datos, para poder usar el repositorio Item en el servicio
    ListItemModule,
  ],
  exports: [
    TypeOrmModule, //Para poder tener acceso a la entidad
    ListsService, //para poder exponer el listsCountByUser
  ]
})
export class ListsModule {}
