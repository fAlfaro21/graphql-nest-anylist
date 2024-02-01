import { BadGatewayException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  //Creamos una propiedad privada
  private logger: Logger = new Logger('UserService'); //Logger se importa de nest. Ponemos UserService porque es donde se sucedería el problema, en caso de haberlo

  constructor(
    @InjectRepository( User ) //Esto es para que trabaje con el inyector de dependencias de nest
    //Necesitamos inyectar nuestro repositorio: Va a trabajar con nuestra entidad de usuarios
    private readonly usersRepository: Repository<User> //Para TyperORM
  ){}

  async create(signupInput: SignupInput): Promise<User> {
    try {

      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 )
      });
      return await this.usersRepository.save( newUser ); //Usamos el método save de TypeORM
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }
  
  async findOneByEmail( email: string ): Promise<User> {
    try {
     return await this.usersRepository.findOneByOrFail({ email }); //Usamos el método findOneByOrFail de TypeORM
    } catch (error) {
 
     //!Podemos implementar el error con esto:
     throw new NotFoundException(`${email} not found`);
     //! ....o, con esto;
     /* this.handleDBError({
       code: 'error-001',
       detail: `${ email } not found`
     }); */
    }
   }

  async findOneById( id: string ): Promise<User> {
  try {
    return await this.usersRepository.findOneByOrFail({ id }); //Usamos el método findOneByOrFail de TypeORM
  } catch (error) {

    //!Podemos implementar el error con esto:
    throw new NotFoundException(`${id} not found`);
    //! ....o, con esto;
    /* this.handleDBError({
      code: 'error-001',
      detail: `${ email } not found`
    }); */
  }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`block method not implemented`)
  }

  private handleDBError( error: any ): never { //JAMAS va a retornar nada
    if( error.code = '23505') { //equivale al error: email already exists
    throw new BadGatewayException(error.detail.replace('Key','') ); //Reemplazamos la palabra KEY por un string vacío
  }
    if( error.code == 'error-001' ) {
      throw new BadGatewayException(error.detail.replace('Key','') );
    }
    this.logger.error( error ); //Para mostrar los logs en caso de error
    throw new InternalServerErrorException('Please check server logs');
  }
}
