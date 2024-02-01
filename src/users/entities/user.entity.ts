import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { type } from 'os';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  //TODO: relaciones y otras cosas
}
