import { Module } from "@nestjs/common";
import { DynamoDBToolboxModule } from "../../src/dynamodb-toolbox.module";
import { UserModule } from "./user/user.module";
import { DynamoDB } from 'aws-sdk'

@Module({
    imports: [
        UserModule,
        DynamoDBToolboxModule.forRoot({
            DocumentClient: new DynamoDB.DocumentClient({
                endpoint: "http://localhost:4567",
                region: "us-east-1",
                credentials: {
                    accessKeyId: "test",
                    secretAccessKey: "test"
                }
            }),
            name: "test-table",
            partitionKey: "pk",
            sortKey: "sk"
        }),
    ]
})
export class AppModule { }