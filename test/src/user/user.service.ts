import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { InjectEntity } from "src/common/dynamodb.decorator";
import { UserEntity } from "./user.entity";


@Injectable()
export class UserService {

    constructor(
        @InjectEntity(UserEntity.name) private entity: typeof UserEntity
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

    async create(name: string) {
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