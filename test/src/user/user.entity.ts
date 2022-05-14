import { Entity } from "dynamodb-toolbox";

export const UserEntity = new Entity({
    name: 'User',
    attributes: {
        pk: { partitionKey: true },
        sk: { sortKey: true },
        name: {
            type: "string"
        }
    }
});