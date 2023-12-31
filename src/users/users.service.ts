import { BadGatewayException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  private logger: Logger = new Logger('UserService');

  constructor(
    @InjectRepository( User ) //Esto es para que trabaje con el inyector de dependencias de nest
    private readonly usersRepository: Repository<User> //Para TyperORM
  ){}

  async create(signupInput: SignupInput): Promise<User> {
    try {

      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync( signupInput.password, 10 )
      });
      return await this.usersRepository.save( newUser );
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail( email: string ): Promise<User> {
   try {
    return await this.usersRepository.findOneByOrFail({ email });
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

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`block method not implemented`)
  }

  private handleDBError( error: any ): never { //JAMAS va a retornar nada
    if( error.code = '23505') {
    throw new BadGatewayException(error.detail.replace('Key','') );
  }
    if( error.code == 'error-001' ) {
      throw new BadGatewayException(error.detail.replace('Key','') );
    }
    this.logger.error( error );
    throw new InternalServerErrorException('Please check server logs');
  }
}
