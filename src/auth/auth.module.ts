import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
  imports: [ 
    
    ConfigModule, //Para tener acceso a las variables de entorno

    PassportModule.register({ defaultStrategy: 'jwt' }),  //Para el manejo de la autenticación JWT

    JwtModule.registerAsync({  //Para el uso del JWT: va a decir cómo firma, como autentica y como verficiar los tokens
      imports: [ ConfigModule ],  //Porque quiero tener acceso a mis variables de entorno
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({   //Para definir de manera async la creación de este módulo. Entre los () podemos incluir la inyección de dependencias (en este caso el ConfigService)
        
        //console.log( configService.get('JWT_SECRET') );
        
        //return{
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '4h'
          }
        //}
      })
    }),

    UsersModule,
   ]
})
export class AuthModule {}
