import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { AuthService } from 'src/auth/auth.service';

//Cuando se utilice va a buscar una función de validación 
//...y realizar el proceso de verificación del payload de nuestro jwt
//...para recibir la info que nosotros esperamos
@Injectable()  //Porque va a ser algo que se va a inyectar
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        private readonly authService: AuthService,
        configService: ConfigService //No hace falta ponerlo como private porque sólo lo voy a manejar en este lugar
    ){
        super({ //Le estamos diciendo a nuestra estrategia:
            // 1. ...La llave para firmar los tokens, es decir, JWT_SECRET, y
            secretOrKey: configService.get('JWT_SECRET'),
            // 2. ...donde va a venir contenido el token: en los headers, como un bearer token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    //Configuramos este método que hace parte de la configuración de la estrategia:
    //Se trata de la definición de un método de validación, así pues
    //verificamos que el usuario existe y que esté activo:
    async validate( payload: JwtPayload ): Promise<User>{
        const { id } = payload;
        const user = await this.authService.validateUser( id );
        //The Passport library expects this callback to return a full user if the validation succeeds, 
        // or a null if it fails (failure is defined as either the user is not found)
        return user;  //req.user
    }
}