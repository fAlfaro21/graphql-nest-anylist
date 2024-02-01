import { ExecutionContext, ForbiddenException, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from "../enums/valid-roles.enum";
import { User } from "src/users/entities/user.entity";

export const CurrentUser = createParamDecorator(
    ( roles: ValidRoles[] = [], context: ExecutionContext ) => {
        //Obtenemos el contexto
        const ctx = GqlExecutionContext.create( context );
        //Del contexto, genero la request...y de esta saco el usuario
        const user: User = ctx.getContext().req.user;

        if( !user ){
            throw new InternalServerErrorException(`No user inside the request - make suer that we used the AuthGuard`);
        }

        //Si no hay restricción de roles en el endpoint, se deja pasar al usuario
        if( roles.length === 0 ) return user 
        //...pero si hay restricción de roles en el endpoint:
        for ( const role of user.roles ) {
            if( roles.includes( role as ValidRoles ) ){ //Si el rol que se solicita, lo tiene el usuario, devuelvo el usuario...sino, lanzo excepción
                return user;
            }
        }

        //Si no existe ningún usuario del for anterior, quiere decir que...
        //..se trata de un usuario que, a pesar de que esté autenticado,
        //..no tiene autorización, por lo tanto lanzo una excepción
        throw new ForbiddenException(
            `User ${ user.fullName } need a valid role [${ roles }]`
        )
})