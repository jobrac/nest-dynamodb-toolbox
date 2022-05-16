import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import { Table } from "dynamodb-toolbox";
import { DYNAMODB_OPTIONS, DYNAMODB_TABLE } from "./dynamodb-toolbox.constants";
import { DynamoDBToolboxModuleOptions, DynamoDBToolboxModuleAsyncOptions, DynamoDBToolboxOptionsFactory } from "./interfaces/dynamodb-toolbox-options.interface";

@Global()
@Module({})
export class DynamoDBToolboxCoreModule {

    static forRoot(options: DynamoDBToolboxModuleOptions): DynamicModule {

        const provider = {
            provide: DYNAMODB_TABLE,
            useFactory: () => new Table(options)
        }

        return {
            module: DynamoDBToolboxCoreModule,
            providers: [provider],
            exports: [provider],
        };
    }



    static forRootAsync(options: DynamoDBToolboxModuleAsyncOptions): DynamicModule {
        const provider = {
            provide: DYNAMODB_TABLE,
            useFactory: (options: DynamoDBToolboxModuleOptions) => new Table(options),
            inject: [DYNAMODB_OPTIONS],
        }

        const asyncProviders = this.createAsyncProviders(options);
        return {
            module: DynamoDBToolboxCoreModule,
            imports: options.imports,
            providers: [...asyncProviders, provider],
            exports: [provider],
        };
    }


    private static createAsyncProviders(options: DynamoDBToolboxModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass as Type<DynamoDBToolboxOptionsFactory>;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: DynamoDBToolboxModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: DYNAMODB_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass ||
                options.useExisting) as Type<DynamoDBToolboxOptionsFactory>,
        ];

        return {
            provide: DYNAMODB_OPTIONS,
            useFactory: async (optionsFactory: DynamoDBToolboxOptionsFactory) =>
                await optionsFactory.createDynamooseOptions(),
            inject,
        };
    }

}