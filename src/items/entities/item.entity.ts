import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

//Con la entidad defino mi tabla de la base de datos
@Entity({ name:'items' }) //Así se llamará mi tabla
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid') //Para asignar automaticamente un id - Para TypeORM
  @Field( () => ID )
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  /* @Column()
  @Field( () => Float )
  quantity: number; */

  @Column({ nullable: true }) //Puede ser que este dato venga o no - Para TypeORM
  @Field( () => String, { nullable: true } ) //Para decirselo a GQL
  quantityUnits?: string; //gr, ml, kg - para typescript

  //Definimos la relación con nuestros usuarios
  //Muchos items pertenecen a un solo usuario (a través del campo user)
  //Nuestra entidad de Item se va a relacionar con la entidad User
  //y se va a enlazar a través del campo items (de la entidad User)
  //El constraint/regla "{ nullable: false }"" dice que no puede ser nulo
  @ManyToOne( () => User, (user) => user.items, { nullable: false, lazy: true } ) //TypeORM. El lazy es para decir que cuando yo haga una consulta para traer los artículos, también me traiga/llene la info del usario
  @Index('userId-index') //Nos añade un indice para optimizar las queries (suponemos que vamos a tener muchos items)
  @Field( () => User ) //GQL
  user: User;

  @OneToMany( () => ListItem, (listItem) => listItem.item, { nullable: false, lazy: true } ) //TypeORM. El lazy es para decir que cuando yo haga una consulta para traer los artículos, también me traiga/llene la info del usario
  @Field( () => [ListItem] ) //Para saber en qué listas ha aparecido el item
  listItem: ListItem[];
}
