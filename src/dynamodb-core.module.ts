import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { Table } from "dynamodb-toolbox";
import { DYNAMODB_INITIALIZATION, DYNAMODB_MODULE_OPTIONS } from "./dynamodb.constants";
import { DynamodbModuleOptions, DynamodbModuleAsyncOptions, DynamodbOptionsFactory } from "./interfaces/dynamodb-options.interface";

@Global()
@Module({})
export class DynamodbCoreModule {

    static forRoot(options: DynamodbModuleOptions): DynamicModule {

        const provider = {
            provide: DYNAMODB_INITIALIZATION,
            useFactory: () => new Table(options)
        }

        return {
            module: DynamodbCoreModule,
            providers: [provider],
            exports: [provider],
        };
    }



    static forRootAsync(options: DynamodbModuleAsyncOptions): DynamicModule {
        const provider = {
            provide: DYNAMODB_INITIALIZATION,
            useFactory: (options: DynamodbModuleOptions) => new Table(options),
            inject: [DYNAMODB_MODULE_OPTIONS],
        }

        const asyncProviders = this.createAsyncProviders(options);
        return {
            module: DynamodbCoreModule,
            imports: options.imports,
            providers: [...asyncProviders, provider],
            exports: [provider],
        };
    }


    private static createAsyncProviders(options: DynamodbModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass as Type<DynamodbOptionsFactory>;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: DynamodbModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: DYNAMODB_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass ||
                options.useExisting) as Type<DynamodbOptionsFactory>,
        ];

        return {
            provide: DYNAMODB_MODULE_OPTIONS,
            useFactory: async (optionsFactory: DynamodbOptionsFactory) =>
                await optionsFactory.createDynamooseOptions(),
            inject,
        };
    }

}