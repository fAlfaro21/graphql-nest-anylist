import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { List } from './entities/list.entity';
import { User } from './../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { PaginationArgs, SearchArgs } from './../common/dto/args';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { ListItem } from 'src/list-item/entities/list-item.entity';


@Resolver(() => List)
@UseGuards( JwtAuthGuard )
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService
  ) {}

  @Mutation(() => List, { name: 'createList' })
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() user: User
    ): Promise<List> {
    return await this.listsService.create( createListInput, user );
  }

  //Solo debe devolver las listas pertenecientes al usuario solicitante
  @Query(() => [List], { name: 'lists' })
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return await this.listsService.findAll( user, paginationArgs, searchArgs );
  }

  @Query(() => List, { name: 'list' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return await this.listsService.findOne( id, user);
  }

  @Mutation(() => List)
  async updateList(@Args('updateListInput') updateListInput: UpdateListInput,
  @CurrentUser() user: User
  ): Promise<List> {
    return await this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  async removeList(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
    ) {
    return await this.listsService.remove(id, user);
  }

  //Para poder hacer la consulta de items en la lista/listItems
  @ResolveField( () => [ListItem], { name: 'items' } ) //Sintaxis de GQL: [ListItem]
  async getListItems(
    @Parent() list: List, //Nos permite tener acceso a los datos del padre, en este caso List
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    ): Promise<ListItem[]>{    //Sintaxis de Typescript: ListItem[]
    return await this.listItemsService.findAll( list, paginationArgs, searchArgs);
  }

  @ResolveField( () => Number, { name: 'totalItems' } )
  async countListItemsByList(
    @Parent() list: List,
  ): Promise<number>{
    return await this.listItemsService.countListItemsByList( list );
  }

}
