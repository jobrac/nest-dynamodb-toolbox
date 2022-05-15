import { Module } from "@nestjs/common";
import { DynamoDBToolboxModule } from "../../../src/dynamodb-toolbox.module";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [
        DynamoDBToolboxModule.forFeature([UserEntity])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }