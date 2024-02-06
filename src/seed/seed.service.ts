import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { Item } from './../items/entities/item.entity';
import { User } from './../users/entities/user.entity';
import { ItemsService } from '../items/items.service';
import { UsersService } from './../users/users.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
    ){
        this.isProd = configService.get('STATE') === 'prod'; //this.isProd sólo va a ser true si es = a prod
    }

    async executeSeed(){

        //1.Verificamos que no se trata de producción: no queremos eliminar la BBDD de prod
        if( this.isProd ){ //Lanzamos excepción si se trata de prod
            throw new UnauthorizedException('We cannot run SEED on Prod')
        }

        //2.Limpiar/Purgar la BBDD: Borrar todo antes de comenzar
        await this.deleteDatabase();

        //Crear usuarios
        const user = await this.loadUsers();

        //Crear items
        await this.loadItems( user );

        return true;
    }


    async deleteDatabase(){

        //Borrar items
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        //Borrar users
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }

    async loadUsers(): Promise<User>{
        const users = [];
        for (const user of SEED_USERS){
            users.push(await this.usersService.create( user ))
        }
        return users[0];
    }

    async loadItems( user: User ): Promise<void>{
        const itemsPromises = [];
        for (const item of SEED_ITEMS){
            itemsPromises.push( this.itemsService.create( item, user ));
        }
        await Promise.all( itemsPromises );
    }

}
