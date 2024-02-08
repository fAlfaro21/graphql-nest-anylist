import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('listItems')
@Unique('listItem-item', ['list','item']) //Añadimos este constrain/validación de BBDD para no tener registros duplicados
@ObjectType()
export class ListItem {
  
  @PrimaryGeneratedColumn('uuid') //Decorador TypeORM
  @Field(() => ID) //Decorador GQL
  id: string; //

  @Column({ type: 'numeric'}) //Decorador TypeORM
  @Field(() => Number) //No se importa el Number porque se utiliza el constructor de Javascript
  quantity: number;

  @Column({ type: 'boolean'}) //Decorador TypeORM
  @Field(() => Boolean)
  completed: boolean;

  //Se va a relacionar con la entidad List y se va a relacionar a través de list.listItem
  @ManyToOne( () => List, (list) => list.listItem, { lazy: true }  )
  @Field(() => List)
  list: List;

  @ManyToOne( () => Item, (item) => item.listItem, { lazy: true }  )
  @Field(() => Item)
  item: Item;
}
