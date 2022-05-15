import { DynamicModule, flatten, Module } from "@nestjs/common";
import { Entity } from "dynamodb-toolbox";
import { SchemaType } from "dynamodb-toolbox/dist/classes/Entity";
import { DynamoDBToolboxCoreModule } from "./dynamodb-toolbox-core.module";
import { createDynamodbProviders, createDynamooseAsyncProviders } from "./dynamodb-toolbox.provider";
import { AsyncEntityFactory } from "./interfaces/async-entity-factory.interface";
import { DynamoDBToolboxModuleAsyncOptions, DynamoDBToolboxModuleOptions } from "./interfaces/dynamodb-toolbox-options.interface";

@Module({})
export class DynamoDBToolboxModule {
    static forRoot(options: DynamoDBToolboxModuleOptions): DynamicModule {
        return {
            module: DynamoDBToolboxModule,
            imports: [DynamoDBToolboxCoreModule.forRoot(options)],
        };
    }

    static forRootAsync(options: DynamoDBToolboxModuleAsyncOptions): DynamicModule {
        return {
            module: DynamoDBToolboxModule,
            imports: [DynamoDBToolboxCoreModule.forRootAsync(options)],
        };
    }

    static forFeature(entities: Array<Entity<SchemaType>> = []): DynamicModule {
        const providers = createDynamodbProviders(entities);
        return {
            module: DynamoDBToolboxModule,
            providers: providers,
            exports: providers,
        };
    }

    static forFeatureAsync(factories: AsyncEntityFactory[] = []): DynamicModule {
        const providers = createDynamooseAsyncProviders(factories);
        const imports = factories.map((factory) => factory.imports || []);
        const uniqImports = new Set(flatten(imports));
        return {
            module: DynamoDBToolboxModule,
            imports: [...uniqImports],
            providers: providers,
            exports: providers,
        };
    }

}