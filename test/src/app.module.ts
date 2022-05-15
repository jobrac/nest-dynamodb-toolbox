import { Module } from "@nestjs/common";
import { DynamoDBToolboxModule } from "../../src/dynamodb-toolbox.module";
import { UserModule } from "./user/user.module";
import { DynamoDB } from 'aws-sdk'

@Module({
    imports: [
        UserModule,
        // DynamoDBToolboxModule.forRoot({
        //     DocumentClient: new DynamoDB.DocumentClient({
        //         endpoint: process.env.AWS_ENDPOINT,
        //         region: process.env.AWS_REGION
        //     }),
        //     name: process.env.DYNAMODB_TABLE_NAME,
        //     partitionKey: "pk",
        //     sortKey: "sk"
        // }),
        DynamoDBToolboxModule.forRootAsync({
            useFactory: () => {
                return {
                    DocumentClient: new DynamoDB.DocumentClient({
                        endpoint: process.env.AWS_ENDPOINT,
                        region: process.env.AWS_REGION
                    }),
                    name: "test",
                    partitionKey: "pk",
                    sortKey: "sk"
                }
            }
        })
    ]
})
export class AppModule { }