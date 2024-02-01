import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver( () => AuthResponse )
export class AuthResolver {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation(
    () => AuthResponse, //Aquí vamos a definir el tipo de info/dato que va a regresar esta mutación, en este caso va a resolver algo de tipo AuthResponse 
    { name: 'signup'} //...junto con un nombre
  ) 
  async singup(
    @Args('signupInput') signupInput: SignupInput
    ): Promise<AuthResponse> {
    return await this.authService.signup( signupInput );
  }

  @Mutation( () => AuthResponse, { name: 'login'}) //Aquí vamos a definir el tipo de dato que vamos a devolver, junto con un nombre
  async login(
    @Args( 'LoginInput' ) loginInput:LoginInput
  ): Promise<AuthResponse>{
    return await this.authService.login( loginInput );
  }


  @Query( () => AuthResponse, { name: 'revalidate'}) //Ojo: Importar @Query de GQL
  //Cuando se invoca este endpoint nuestro Guard (JwtAuthGuard), automaticamente se invoca nuestra estrategia (así pues valida el JWT):
  @UseGuards( JwtAuthGuard ) //Aplicamos la autenticación: Utilizamos nuestro Guard personalizado para verificar que el token sea válido/correcto y que el usuario esté activo
  revalidateToken(
    @CurrentUser( /* [ ValidRoles.admin ] */ ) user: User  //Utilizamos este decorador personalizado para obtener el usuario y dejarlo en el argumento "user". Sólo los admin podrán ejecutar el endpoint
  ): AuthResponse{
      return this.authService.revalidateToken( user );
    
  }
}
