import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

//Esto trabaja en conjunto con passport
//Defino mi guard con el nombre JwtAuthGuard y lo extiendo del AuthGuard que viene con passport (para trabajar con el contexto de GQL)
export class JwtAuthGuard extends AuthGuard('jwt'){ //Especifico el modo 'jwt' de lo que me ofrece passport
    //!Voy a sobrescribir el método getRequest, que viene por estándar de AuthGuard
    getRequest( context: ExecutionContext ){

        const ctx = GqlExecutionContext.create( context );
        const request = ctx.getContext().req;
        return request;

    }
}