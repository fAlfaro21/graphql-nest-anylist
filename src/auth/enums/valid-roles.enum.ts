import { registerEnumType } from "@nestjs/graphql";


export enum ValidRoles {
    admin = 'admin',
    user = 'user',
    superUser = 'superUser'
}

//Es preciso registrar la enumeración para que sea reconocida por GQL 
//en nuestro argumento personalizado ValidRolesArgs
//También es necesario poner: la enumeración y un nombre
registerEnumType( ValidRoles, { name: 'ValidRoles', description: 'Valores permitidos para los roles de la enumeración' }  ) 