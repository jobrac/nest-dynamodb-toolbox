import { flatten } from "@nestjs/common";
import { Table } from "dynamodb-toolbox";
import { Entity } from "dynamodb-toolbox";
import { SchemaType } from "dynamodb-toolbox/dist/classes/Entity";
import { getEntityToken } from "./common/dynamodb-toolbox.utils";
import { DYNAMODB_TOOLBOX_INITIALIZATION } from "./dynamodb-toolbox.constants";
import { AsyncEntityFactory } from "./interfaces/async-entity-factory.interface";

export function createDynamodbProviders(entities: Array<Entity<SchemaType>> = []) {
    const providers = (entities || []).map((entity) => ({
        provide: getEntityToken(entity.name),
        useFactory: (table: Table) => {
            entity.table = table;
            return entity
        },
        inject: [DYNAMODB_TOOLBOX_INITIALIZATION],
    }));
    return providers;
}

export function createDynamooseAsyncProviders(
    entityFactories: AsyncEntityFactory[] = [],
) {
    const providers = (entityFactories || []).map((entity) => [
        {
            provide: getEntityToken(entity.name),
            useFactory: async (...args: unknown[]) => {
                const table = await entity.useFactory(...args);
                entity.table = table;
                return entity
            },
            inject: [DYNAMODB_TOOLBOX_INITIALIZATION, ...(entity.inject || [])],
        },
    ]);
    return flatten(providers);
}