import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { ValidRoles } from "src/auth/enums/valid-roles.enum";

@ArgsType()  //Del GQL, porque va a ser un tipo personalizado de argumento
export class ValidRolesArgs {

    @Field( () => [ValidRoles], { nullable: true } ) //GQL
    @IsArray() //Del class validator
    roles: ValidRoles[] = [] //Typescript

}