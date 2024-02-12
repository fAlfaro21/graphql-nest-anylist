import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,
    //forbidNonWhitelisted: true,  comentamos esta opción del class validator (o ponemos false) para poder recibir más información de la que yo espero (enviar varios argumentos en items findAll)
    //No es necesario puesto que GQL ya se encarga de ello
    })
   );

  await app.listen(3000);

  //Para despliegue con Digital Ocean
  //  const PORT = process.env.PORT || 3000
  //  await app.listen( PORT );
  //  console.log(`App running on port ${PORT}`)

}
bootstrap();
