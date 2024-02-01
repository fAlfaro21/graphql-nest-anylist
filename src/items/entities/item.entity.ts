import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  @Field( () => Float )
  quantity: number;

  @Column({ nullable: true }) //Puede ser que este dato venga o no - Para TypeORM
  @Field( () => String, { nullable: true } ) //Para decirselo a GQL
  quantityUnits?: string; //gr, ml, kg - para typescript
}
