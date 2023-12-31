import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './dto/types/auth-response.type';

@Resolver()
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

/*
  @Query({ name: revalidate})
  async revalidateToken(){
    //return await this.authService.revalidateToken();
  } */
}
