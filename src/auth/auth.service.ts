import { Injectable } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './dto/types/auth-response.type';
import { UsersService } from '../users/users.service';

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

}
