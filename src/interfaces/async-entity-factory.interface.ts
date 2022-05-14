import { ModuleMetadata } from "@nestjs/common";
import { Entity } from "dynamodb-toolbox";
import { SchemaType } from "dynamodb-toolbox/dist/classes/Entity";

export interface AsyncEntityFactory extends Pick<ModuleMetadata, 'imports'>, Entity<SchemaType> {
    useFactory: (
        ...args: any[]
    ) => Entity<SchemaType>['schema'] | Promise<Entity<SchemaType>['schema']>;
    inject?: any[];
}