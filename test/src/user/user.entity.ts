import { Entity } from "dynamodb-toolbox";

export const UserEntity = new Entity<User>({
    name: 'User',
    attributes: {
        pk: { partitionKey: true },
        sk: { sortKey: true },
        name: {
            type: "string"
        }
    }
});

export interface User {
    pk: string,
    sk: string,
    name: string
}