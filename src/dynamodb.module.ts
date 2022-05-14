import { DynamicModule, flatten, Module } from "@nestjs/common";
import { Entity } from "dynamodb-toolbox";
import { SchemaType } from "dynamodb-toolbox/dist/classes/Entity";
import { DynamodbCoreModule } from "./dynamodb-core.module";
import { createDynamodbProviders, createDynamooseAsyncProviders } from "./dynamodb.provider";
import { AsyncEntityFactory } from "./interfaces/async-entity-factory.interface";
import { DynamodbModuleAsyncOptions, DynamodbModuleOptions } from "./interfaces/dynamodb-options.interface";

@Module({})
export class DynamodbModule {
    static forRoot(options: DynamodbModuleOptions): DynamicModule {
        return {
            module: DynamodbModule,
            imports: [DynamodbCoreModule.forRoot(options)],
        };
    }

    static forRootAsync(options: DynamodbModuleAsyncOptions): DynamicModule {
        return {
            module: DynamodbModule,
            imports: [DynamodbCoreModule.forRootAsync(options)],
        };
    }

    static forFeature(entities: Array<Entity<SchemaType>> = []): DynamicModule {
        const providers = createDynamodbProviders(entities);
        return {
            module: DynamodbModule,
            providers: providers,
            exports: providers,
        };
    }

    static forFeatureAsync(factories: AsyncEntityFactory[] = []): DynamicModule {
        const providers = createDynamooseAsyncProviders(factories);
        const imports = factories.map((factory) => factory.imports || []);
        const uniqImports = new Set(flatten(imports));
        return {
            module: DynamodbModule,
            imports: [...uniqImports],
            providers: providers,
            exports: providers,
        };
    }

}