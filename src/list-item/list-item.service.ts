import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { PaginationArgs, SearchArgs } from './../common/dto/args';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository( ListItem )
    private readonly listItemsRepository: Repository<ListItem>,
  ){}


  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    })
    
    await this.listItemsRepository.save( newListItem );
    return this.findOne( newListItem.id );
  }

  async findAll( list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;	
    const { search } = searchArgs;

    //1. Primera forma, con QueryBuilder
    const queryBuilder = this.listItemsRepository.createQueryBuilder()
      .take( limit )
      .skip( offset )
      .where( `"listId" = :listId`, { listId: list.id } ) //la variable listId va a apuntar al valor de list.id

    //Si existe search, añade una nueva condición where
    if ( search ) {
      queryBuilder.andWhere('LOWER(name) like :name', { name: `%${ search.toLowerCase() }%` })
    }

      return queryBuilder.getMany();
  }

  async findOne( id: string ): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy( {id} );
    if( !listItem ){
      throw new NotFoundException(`This item with id ${id} does not exist`);
    }
    return listItem;
  }

  async update(
    id: string, updateListItemInput: UpdateListItemInput
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;
    const queryBuilder = this.listItemsRepository.createQueryBuilder()
      .update()
      .set( rest )
      .where( 'id = :id', { id } )

    if ( listId ) queryBuilder.set({ list: { id: listId }})
    if ( itemId ) queryBuilder.set({ item: { id: itemId }})

    await queryBuilder.execute();

    return this.findOne( id );
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async countListItemsByList( list:List ): Promise<number>{
    return this.listItemsRepository.count({
      where: {
        list: {
          id: list.id,
        }
      }
    });
  }
}
