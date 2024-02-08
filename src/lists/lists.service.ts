import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { List } from './entities/list.entity';
import { User } from './../users/entities/user.entity';

import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

@Injectable()
export class ListsService {

  constructor(
    //Para poder hacer operaciones con mi BBDD
    @InjectRepository( List ) //De typeORM, para inyectar el respositorio List y poder utilizarlo
    private readonly listsRepository: Repository<List>
  ){}


  async create(createListInput: CreateListInput, user:User ): Promise<List> {
    const newList = this.listsRepository.create({...createListInput, user}) //Desestructuro lo que viene en el createItemInput y adicionalmente voy a colocar ahí el valor del usuario
    return await this.listsRepository.save( newList );
  }

  //Solo debe devolver las listas pertenecientes al usuario solicitante
  async findAll( user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs  ): Promise<List[]> {

    const { limit, offset } = paginationArgs;	
    const { search } = searchArgs;

    //1. Primera forma, con QueryBuilder
    const queryBuilder = this.listsRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where( `"userId" = :userId`, { userId: user.id } ) //la variable userId va a apuntar al valor de user.id

    //Si existe search, añade una nueva condición where
    if ( search ) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search.toLowerCase() }%` })
    }

      return queryBuilder.getMany();
    //Es equivalente a decir: 
    //select * from items where userId = '123456-123456-123456'
    //2. Otra forma de hacerlo, con find:
    /* return this.listsRepository.find({
      take: limit,
      skip: offset,
      where: {
        user: {
          id: user.id
        },
        name: Like(`%${ search.toLocaleLowerCase() }%`),
      }
    }); */
  }

  async findOne( id: string, user: User ): Promise<List> {
    const list = await this.listsRepository.findOneBy({ 
      id,
      user: {
        id: user.id
      } 
      //también podría añadir más cosas con el query builder .andwhere 
    });
    if ( !list ) throw new NotFoundException(`List with id: ${ id } not found`);
    //list.user = user;
    return list
  }

  async update( id: string, updateListInput: UpdateListInput, user: User ): Promise<List> {
    await this.findOne( id, user );
    
    //Podemos utilizar el findOne o  bien, el preload:
    const list = await this.listsRepository.preload( {...updateListInput, user} ) //el preload hace una búsqueda primero y luego carga la entidad
    //const item = await this.itemsRepository.preload(...updateItemInput, user) //en caso de que no pusieramos el lazy en la entidad Item

    if ( !list ) throw new NotFoundException(`List with id: ${ id } not found`); //Si el item es nulo salta la excepción
    
    return await this.listsRepository.save( list );
  }

  async remove(id: string, user: User): Promise<List> {
    //TODO: soft delete, integridad referencial
    const list = await this.findOne( id, user ) //el preload hace una búsqueda primero y luego carga la entidad    
    await this.listsRepository.remove( list );
    return { ...list, id };
  }

  async listsCountByUser( user:User ): Promise<number>{
    return this.listsRepository.count({
      where: {
        user: {
          id: user.id,
        }
      }
    });
  }
}
