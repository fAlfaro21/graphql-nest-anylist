import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from 'src/items/entities/item.entity';

//Con la entidad defino mi tabla de la base de datos
@Entity({ name: 'users' }) //Así se llamará mi tabla
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID )
  id: string;

  @Column() //Decorador de TypeORM
  @Field(() => String )
  fullName: string;

  @Column({  unique: true }) //Crea un índice de único y hace que la consulta sea más rápida
  @Field(() => String )
  email: string;

  @Column()
  //@Field(() => String )  NO SE coloca porque no vamos a hacer queries del password
  password: string;

  @Column({ 
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field(() => [String] )
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  }) //Decorador de TypeORM
  @Field(() => Boolean )
  isActive:boolean;

  //TODO: relaciones
  //Un usuario que ha acutalizado un registro puede aparecer en varios registros, y un registro sólo tendrá un usuario
  //Nos pide la relación izauierda y la relación derecha
  @ManyToOne( () => User, (user) => user.lastUpdatedBy, {nullable: true, lazy: true} ) //ver la docu de TypeORM para lazy: cuando se hacen consultas el lazy carga la relación
  @JoinColumn({ name: 'lastUpdatedBy' }) //Porque necesitamos que siempre esté ahí
  @Field(() => User, {nullable: true} ) //Hay que poner esto para GQL, que puede ser nulo
  lastUpdatedBy?: User;

  //Definimos la relación con los items
  //Un usuario puede tener muchos items
  //Nuestra entidad de usuarios se va a relacionar con la entidad Item
  //Y, por cada instancia que yo tenga de mis items, se va a enlazar con el campo de user (de la entidad Item)
  @OneToMany( () => Item, (item) => item.user, { lazy: true })
  //@Field( () => [Item] )  //Evito que pueda consultarse, como hicimos como el password...porque configuramos un nuevo @ResolveField(llamdo getItemsByUser)
  items: Item[]

}
