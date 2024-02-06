import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ItemsService } from 'src/items/items.service';
import { Item } from './../items/entities/item.entity';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { PaginationArgs, SearchArgs } from './../common/dto/args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards( JwtAuthGuard ) //De Nest
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs, //Hicimos un argumento personalizdo : ValidRolesArgs
    @CurrentUser( [ValidRoles.admin] ) user: User
    ): Promise<User[]> {      
    return this.usersService.findAll( validRoles.roles );
  }

  @Query(() => User, { name: 'user' })
  findOne(
    //El ParseUUIDPipe nos ayuda a validar que se trate de un UUID
    @Args( 'id', { type: () => ID }, ParseUUIDPipe ) id: string,
    @CurrentUser( [ ValidRoles.admin, ValidRoles.superUser ] ) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser( [ ValidRoles.admin ] ) user: User
    ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser( [ ValidRoles.admin ] ) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' }) //Creamos una modificación en nuestro esquema diciendo que hay un nuevo campo
  async itemCount(
    @CurrentUser( [ ValidRoles.admin ] ) adminUser: User,
    @Parent() user: User, //Nos permite tener acceso a los datos del padre, en este caso User
  ): Promise<number> {
    return this.itemsService.itemsCountByUser( user );
  }

  @ResolveField(() => [Item], { name: 'items' }) //Creamos una modificación en nuestro esquema diciendo que hay un nuevo campo. [Item] es GQL
  async getItemsByUser(
    @CurrentUser( [ ValidRoles.admin ] ) adminUser: User,
    @Parent() user: User, //Nos permite tener acceso a los datos del padre, en este caso User
    @Args() paginationArgs:PaginationArgs,
    @Args() searchArgs:SearchArgs
  ): Promise<Item[]> {  //<Item[]> es Typescript
    return this.itemsService.findAll( user, paginationArgs, searchArgs );
  }

}
