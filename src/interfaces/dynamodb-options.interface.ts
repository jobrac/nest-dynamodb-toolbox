import { ModuleMetadata, Type } from "@nestjs/common";
import { TableConstructor } from "dynamodb-toolbox/dist/classes/Table";


export interface DynamodbModuleOptions extends TableConstructor { }


export interface DynamodbOptionsFactory {
    createDynamooseOptions(): | Promise<DynamodbModuleOptions> | DynamodbModuleOptions;
}

export interface DynamodbModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<DynamodbOptionsFactory>;
    useClass?: Type<DynamodbOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<DynamodbModuleOptions> | DynamodbModuleOptions;
    inject?: any[];
}
