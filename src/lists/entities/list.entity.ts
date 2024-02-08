import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  //relación de mi entidad y el index con el nombre 'userId-list-index'
  @ManyToOne( () => User, (user) => user.lists, { nullable: false, lazy: true } )
  @Index( 'userId-list-index' )
  @Field(() => User)
  user: User;

  //Se va a relacionar con la entidad List y se va a relacionar a través de listItem.list
  //Este campo va a devolver todos los articulos en la lista
  @OneToMany( () => ListItem, (listItem) => listItem.list, { lazy: true } )
  //@Field(() => [ListItem]) //GQL. Es un campo que va a devolver listItems
  listItem: ListItem; //Typescript

}
