import { Field, ObjectType } from "@nestjs/graphql";
import { User } from '../../users/entities/user.entity';

//Es para lo que queremos responder en la query, por ejemplo, a un usuario cuando se registre
@ObjectType()
export class AuthResponse{

    @Field( () => String )
    token: string;

    @Field( () => User )
    user: User; //Esta información va a venir del módulo de usuarios

}