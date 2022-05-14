import { Module } from "@nestjs/common";
import { DynamodbModule } from "src/dynamodb.module";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [
        DynamodbModule.forFeature([UserEntity])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }