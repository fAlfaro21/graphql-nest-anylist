import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { User } from 'src/users/entities/user.entity';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {

  constructor(
    //Para poder hacer operaciones con mi BBDD
    @InjectRepository( Item ) //De typeORM, para inyectar el respositorio Item y poder utilizarlo
    private  readonly itemsRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({...createItemInput, user}) //Desestructuro lo que viene en el createItemInput y adicionalmente voy a colocar ahí el valor del usuario
    return await this.itemsRepository.save( newItem );
  }

  //Solo debe devolver los artículos pertenecientes al usuario solicitante
  async findAll( user: User ): Promise<Item[]> {
    //Es equivalente a decir: 
    //select * from items where userId = '123456-123456-123456'
    return this.itemsRepository.find({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }

  async findOne( id: string, user: User ): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ 
      id,
      user: {
        id: user.id
      } 
      //también podría añadir más cosas con el query builder .andwhere 
    });
    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`);
    //item.user = user;
    return item
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> { //Se trata de  una promesa que resuelve un item
    
    await this.findOne( id, user );
    
    //Podemos utilizar el findOne o  bien, el preload:
    const item = await this.itemsRepository.preload(updateItemInput) //el preload hace una búsqueda primero y luego carga la entidad
    //const item = await this.itemsRepository.preload(...updateItemInput, user) //en caso de que no pusieramos el lazy en la entidad Item

    if ( !item ) throw new NotFoundException(`Item with id: ${ id } not found`); //Si el item es nulo salta la excepción
    
    return await this.itemsRepository.save( item );
  }

  async remove(id: string, user: User): Promise<Item> {
    //TODO: soft delete, integridad referencial
    const item = await this.findOne( id, user ) //el preload hace una búsqueda primero y luego carga la entidad    
    await this.itemsRepository.remove( item );
    return { ...item, id };
  }

  async itemsCountByUser( user:User ): Promise<number>{
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        }
      }
    });
  }

}
