import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { Table } from "dynamodb-toolbox";
import { InjectEntity, InjectTable } from "../../../src/common/dynamodb-toolbox.decorator";
import { UserEntity } from "./user.entity";


@Injectable()
export class UserService {

    constructor(
        @InjectEntity(UserEntity.name) private entity: typeof UserEntity,
        @InjectTable() private table: Table
    ) { }

    async getAll() {
        return await this.entity.scan();
    }

    async get(id: string) {
        return await this.entity.get({
            pk: id,
            sk: id
        });
    }

    async create(name: string | Array<string>) {

        if (Array.isArray(name)) {
            return await this.table.transactWrite(name.map(e => {
                const randomId = randomBytes(10).toString("hex")

                return this.entity.putTransaction({
                    pk: randomId,
                    sk: randomId,
                    name: e,
                })
            }), {
                capacity: 'total',
                metrics: 'size',
            })
        }

        const randomId = randomBytes(10).toString("hex")

        return await this.entity.put({
            pk: randomId,
            sk: randomId,
            name
        })
    }

    async update(id: string, name: string) {
        return await this.entity.update({
            pk: id,
            sk: id,
            name
        })
    }

    async delete(id: string) {
        return await this.entity.delete({
            pk: id,
            sk: id
        })
    }
}