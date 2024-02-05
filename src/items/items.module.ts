import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { Item } from './entities/item.entity';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [
    TypeOrmModule.forFeature([ Item ])//Vincula la entidad con la base de datos, para poder usar el repositorio Item en el servicio
  ],
  exports: [
    ItemsService, //para poder exponer el itemsCountByUser
    TypeOrmModule,
  ]
})
export class ItemsModule {}
