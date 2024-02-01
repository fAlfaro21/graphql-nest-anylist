import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService //Para poder firmar los JWTs
    ){}

    private getJwtToken( userId: string ){
        return this.jwtService.sign({ id: userId }); // Retorna el token para poder verificar/autenticar/autorizar al usuario para que tenga acceso a algún recurso
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        //Crear usuario
        const user = await this.userService.create( signupInput );

        //Crear JWT
        const token = this.getJwtToken( user.id ); //solo voy a incluir en el payload, el id

        return {
            token,
            user
        }

    }

    async login( loginInput: LoginInput): Promise<AuthResponse>{

        //Comprueba que exista el usuario
        const { email, password } = loginInput;
        const user = await this.userService.findOneByEmail( email );
        
        //Comprueba que el password es correcto
        if ( !bcrypt.compareSync( password, user.password) ) {
            throw new BadRequestException('Email/Password do not match');
        }

        //Crear JWT
        const token = this.getJwtToken( user.id );

        return{
            token,
            user
        }
    }

    //Verificamos que el usuario existe y que esté activo - para la estrategia:
    async validateUser( id: string ): Promise<User> {
        const user = await this.userService.findOneById( id );
        if ( !user.isActive )
            throw new UnauthorizedException(`User is inactive, talk to the administrator`);
        delete user.password; //No queremos devolver el password y que fluya por ningún lugar
        return user;
    }

    revalidateToken( user: User ): AuthResponse {
        const token = this.getJwtToken( user.id );
        return { 
            token, 
            user
        };
    }
}
