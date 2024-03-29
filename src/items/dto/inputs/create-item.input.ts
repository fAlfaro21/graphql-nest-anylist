import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field( () => String )
  @IsNotEmpty()
  @IsString()
  name: string;

/*   @Field( () => Float )
  @IsPositive()
  quantity: number; */

  @Field( () => String, { nullable: true } ) //nullable para hacerlo opcional para GQL
  @IsString()
  @IsOptional() //nullable para hacerlo opcional para class validator
  quantityUnits?: string; //nullable para hacerlo opcional para Typescript
  
}
