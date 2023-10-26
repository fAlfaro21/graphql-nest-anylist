import { BadGatewayException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import * as brcypt from 'bcrypt';

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
        password: brcypt.hashSync( signupInput.password, 10 )
      });
      return await this.usersRepository.save( newUser );
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: string): Promise<User> {
    throw new Error(`findOne not implemented`)
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`block method not implemented`)
  }

  private handleDBError( error: any ): never { //JAMAS va a retornar nada
    this.logger.error( error );
    if( error.code = '23505') throw new BadGatewayException(error.detail.replace('Key','') );
    throw new InternalServerErrorException('Please check server logs');
  }
}
