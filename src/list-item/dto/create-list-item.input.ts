import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNumber, Min, IsOptional, IsBoolean, IsUUID } from 'class-validator';

@InputType()
export class CreateListItemInput {
  
  @Field( () => Number, { nullable: true } ) //Si viene nulo tomará el valor por defecto de 0
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;
  
  @Field( () => Boolean, { nullable: true } )
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;
  
  @Field( () => ID )
  @IsUUID()
  listId: string;
  
  @Field( () => ID )
  @IsUUID()
  itemId: string;

}
