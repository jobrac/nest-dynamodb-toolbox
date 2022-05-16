import { DYNAMODB_TABLE } from "../dynamodb-toolbox.constants";

export const getEntityToken = (entity: string) => {
    return `${entity}Entity`;
}

export const getTableToken = () => {
    return DYNAMODB_TABLE
}