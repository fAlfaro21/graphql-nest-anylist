import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { type } from 'os';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

}
