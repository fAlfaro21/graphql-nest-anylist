import { BadGatewayException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
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

  async findAll( roles:ValidRoles[] ): Promise<User[]> {

    //Si no se definió ningún rol....devuelve todos
    if(roles.length === 0) 
      return await this.usersRepository.find({
        //Para decirle a GQL que cargue la relación al mostrar los datos (cuando no se ha determinado el argumento)
        //No obstante ya no hace falta al haber puesto el lazy como propiedad al campo lastUpdatedBy en nuestra entidad User
        /* relations: { 
          lastUpdatedBy: true,
        } */
      });
    //Si tenemos algún/os roles...
    return this.usersRepository.createQueryBuilder()
    //Me va a mirar que los roles hagan match (ver docu postgres: Array Functions and Operators)
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')  //Debe hacer match los roles de la BBDD con los del argumento
      .setParameter('roles', roles) //Hace referencia a los roles en la línea 41 y los roles en el argumento, linea 35
      .getMany();

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

  async update(id: string, updateUserInput: UpdateUserInput, updateBy: User): Promise<User> {
    try {
      const user = await this.usersRepository.preload({...updateUserInput, id})
      user.lastUpdatedBy = updateBy;
      return await this.usersRepository.save( user );
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async block(id: string, adminUser: User ): Promise<User> {
    const userToBlock = await this.findOneById( id );
    userToBlock.isActive = false;
    userToBlock.lastUpdatedBy = adminUser;
    return await this.usersRepository.save( userToBlock ); 
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
