import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {

  constructor(
    //Para poder hacer operaciones con mi BBDD
    @InjectRepository( Item )
    private  readonly itemsRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput)
    return await this.itemsRepository.save( newItem );
  }

  async findAll(): Promise<Item[]> {

    return this.itemsRepository.find();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id });
    if ( !item ) throw new NotFoundException(`Item with id not found`);
    return item
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> { //Se trata de  una promesa que resuelve un item
    const item = await this.itemsRepository.preload(updateItemInput) //el preload hace una búsqueda primero y luego carga la entidad
    
    if ( !item ) throw new NotFoundException(`Item with id not found`); //Si el item es nulo...
    
    return await this.itemsRepository.save( item );
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne( id ) //el preload hace una búsqueda primero y luego carga la entidad    
    await this.itemsRepository.remove( item );
    return { ...item, id };
  }
}
