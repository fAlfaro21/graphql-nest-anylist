<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

### Resumen

CRUD de ítems para nuestro backend, base de datos Postgres con Nest + GraphQL:
Postgres
TypeORM
Entidades con GraphQL Object Types
CRUD (Queries y Mutations)

#### Autenticación y autorización de usuarios:

Protección de queries y mutations,
Creación de usuarios desde GraphQL,
Login,
Revalidación de token de autenticación,
JWT

# Dev

1. Clonar el proyecto
2. Copiar el ```env.template``` y renombrar a ```.env```
3. Ejecutar
```
yarn install
```
4.  Levantar la imagen (Docker desktop)
```
docker-compose up -d
```

5. Levantar el backend de Nest
```
yarn start:dev
```

6. Visitar el sitio
```
localhost:3000/graphql
```