import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [

    ConfigModule.forRoot(),

    //Configuración GQL forRootAsync:
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [
        AuthModule  //Para que el forRootAsync pueda tener acceso a todo lo que AuthModule ofrece (poder verificar el token)
      ],
      inject: [
        JwtService //De igual forma necsito el servicio, que viene en el módulo AuthModule, para tener el tipado
      ],
      useFactory: async( jwtService: JwtService ) => ({
        playground: false,
          autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
          plugins: [
            ApolloServerPluginLandingPageLocalDefault()
          ],
          context({ req }){

            //Comentamos esta parte porque el login tiene que pasar por aquí para generar el esquema..
            //..y al momento del login no tenemos un token, con lo que no nos permitiría seguir
            //Lo suyo sería tener el login y el signup tercializado o fuera, en otro restful API aparte

            /* const token = req.headers.authorization?.replace('Bearer ','');
            if ( !token ) throw Error('Token needed');

            const payload = jwtService.decode(token);
            if ( !payload ) throw Error('Token not valid'); */
            
          }
      })
    }),


    //Configuración GQL básica:
/*     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
        ]
      }), */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //OJO: El synchronize sólo para desarrollo, pues actualiza cualquier cambio en la BBDD...en producción es peligroso
      //...para crear las tablas definidas en las entidades, de forma automática
      synchronize: true,
      autoLoadEntities: true, //NestJS puede realizar por nosotros el proceso de cargar las entidades en TypeORM automáticamente, sin que las tengamos que indicar en el array de la propiedad "entities"
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
