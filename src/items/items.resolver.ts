import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => Item)
@UseGuards( JwtAuthGuard ) //Nos garantiza que para realizar cualquier acción hay que estar autenticado
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
    ): Promise<Item> {
    return await this.itemsService.create(createItemInput, user);
  }

  //Solo debe devolver los artículos pertenecientes al usuario solicitante
  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User
  ): Promise<Item[]> {
    return await this.itemsService.findAll( user );
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<Item> { // el ParseUUIDPipe, valida que se trate de un uuid, que tenga el formato esperado
    return await this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  async updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User
  ): Promise<Item> {
    return await this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item)
  async removeItem(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
    ): Promise<Item> {
    return await this.itemsService.remove(id, user);
  }
}
