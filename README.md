<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
<a href="https://www.npmjs.com/package/nest-dynamodb-toolbox"><img src="https://img.shields.io/npm/v/nest-dynamodb-toolbox" alt="NPM Version"></a>
<a href="https://github.com/jobrac/nest-dynamodb-toolbox/blob/main/LICENCE.txt"><img src="https://img.shields.io/github/license/jobrac/nest-dynamodb-toolbox" alt="Package License"></a>
<a href="https://www.npmjs.com/package/nest-dynamodb-toolbox"><img src="https://img.shields.io/npm/dm/nest-dynamodb-toolbox.svg" alt="NPM Downloads" /></a>
</p>

## Description

[dynamodb-toolbox](https://github.com/jeremydaly/dynamodb-toolbox) module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm install --save nest-dynamodb-toobox dynamodb-toolbox aws-sdk
```

## Example Project

A [AWS NestJS Starter](https://github.com/hardyscc/aws-nestjs-starter) project has been created to demo the usage of this library.

## Quick Start

**1. Add import into your app module**

`src/app.module.ts`

```ts
import { DynamoDBToolboxModule } from "nest-dynamodb-toolbox";
import { UserModule } from "./user/user.module";
import { DynamoDB } from 'aws-sdk'

@Module({
 imports: [
    UserModule,
    DynamoDBToolboxModule.forRoot({
        DocumentClient: new DynamoDB.DocumentClient({
            endpoint: "http://localhost:4567",
            region: "us-east-1",
            credentials: {
                accessKeyId: "test",
                secretAccessKey: "test"
            }
        }),
        name: "test-table",
        partitionKey: "pk",
        sortKey: "sk"
    }),
 ],
})
export class AppModule {
```

Check [here](https://github.com/jeremydaly/dynamodb-toolbox#tables) for `forRoot()` definition. 


There is also `forRootAsync(options: DynamoDBToolboxModuleAsyncOptions)` if you want to use a factory with dependency injection.

**2. Create a schema**

`src/user/user.schema.ts`

```ts
import { Entity } from "dynamodb-toolbox";

export const UserEntity = new Entity<User>({
    name: 'User',
    attributes: {
        pk: { partitionKey: true },
        sk: { sortKey: true },
        name: {
            type: "string"
        }
    },
    //table not needed
});

export interface User {
    pk: string,
    sk: string,
    name: string
}

```

**3. Add the entities you want to inject to your modules**

This can be a feature module (as shown below) or within the root AppModule next to `DynamoDBToolboxModule.forRoot()`.

`src/user/user.module.ts`

```ts
import { DynamoDBToolboxModule } from 'nest-dynamodb-toolbox';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    DynamoDBToolboxModule.forFeature([UserSchema ]),
  ],
  providers: [
    UserService,
    ...
  ],
})
export class UserModule {}
```

There is also `forFeatureAsync(factories?: AsyncEntityFactory[])` if you want to use a factory with dependency injection.

**4. Inject and use your entity**

`src/user/user.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { InjectEntity } from 'nest-dynamodb-toolbox';
import { UserEntity } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectEntity(UserEntity.name)
    private userEntity: typeof UserEntity,
  ) {}

  create(user) {
    return this.userEntity.put(user);
  }

  update(id, user) {
    return this.userEntity.update({
      ...user
      sk : id,
      pk : id,
    });
  }

  async getAll() {
    return await this.entity.scan();
  }

  async get(id: string) {
    return await this.entity.get({
      pk: id,
      sk: id
    });
  }
}
```

**5. Injecting Table class instance**
```ts
import { Injectable } from '@nestjs/common';
import { InjectEntity, InjectTable } from 'nest-dynamodb-toolbox';
import { UserEntity } from './user.interface';
import { Table } from "dynamodb-toolbox";

@Injectable()
export class UserService {
  constructor(
    @InjectTable() 
    private table: Table,
    @InjectEntity(UserEntity.name)
    private userEntity: typeof UserEntity,
  ) {}

  async transaction() {
    return await this.table.transactWrite([
      this.entity.putTransaction({
        pk: randomId,
        sk: randomId,
        name: e,
      }),
      this.entity.putTransaction({
        pk: randomId,
        sk: randomId,
        name: e,
      })
    ])
  }
}
```