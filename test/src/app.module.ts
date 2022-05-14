import { Module } from "@nestjs/common";
import { DynamodbModule } from "src/dynamodb.module";
import { UserModule } from "./user/user.module";
import { DynamoDB } from 'aws-sdk'

@Module({
    imports: [
        UserModule,
        DynamodbModule.forRoot({
            DocumentClient: new DynamoDB.DocumentClient(),
            name: "test",
            partitionKey: "pk",
            sortKey: "sk"
        })
    ]
})
export class AppModule { }