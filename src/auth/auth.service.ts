import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './dto/types/auth-response.type';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService
    ){}

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        //Crear usuario
        const user = await this.userService.create( signupInput );

        //Crear JWT
        const token = 'abc';

        return {
            token,
            user
        }

    }

    async login( loginInput: LoginInput): Promise<AuthResponse>{
        const { email, password } = loginInput;
        const user = await this.userService.findOneByEmail( email );
        

        if ( !bcrypt.compareSync( password, user.password) ) {
            throw new BadRequestException('Email/Password do not match');
        }

        const token = '123';

        return{
            token,
            user
        }
    }
}
