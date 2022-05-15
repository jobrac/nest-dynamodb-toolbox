import { ModuleMetadata, Type } from "@nestjs/common";
import { TableConstructor } from "dynamodb-toolbox/dist/classes/Table";


export interface DynamoDBToolboxModuleOptions extends TableConstructor { }


export interface DynamoDBToolboxOptionsFactory {
    createDynamooseOptions(): | Promise<DynamoDBToolboxModuleOptions> | DynamoDBToolboxModuleOptions;
}

export interface DynamoDBToolboxModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<DynamoDBToolboxOptionsFactory>;
    useClass?: Type<DynamoDBToolboxOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<DynamoDBToolboxModuleOptions> | DynamoDBToolboxModuleOptions;
    inject?: any[];
}
