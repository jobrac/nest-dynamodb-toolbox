import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './src/app.module';
import { DynamoDB } from 'aws-sdk';
import * as dynalite from 'dynalite';


const dynaliteServer = dynalite({ createTableMs: 50 });
const dynamodb = new DynamoDB({
  endpoint: "http://localhost:4567",
  region: "us-east-1",
  credentials: {
    secretAccessKey: "test",
    accessKeyId: "test"
  }
})

describe('Basic CRUD Test', () => {
  let app: INestApplication;
  let id: string;

  beforeAll(async () => {

    await new Promise((resolve, reject) => {
      dynaliteServer.listen(4567, async (err) => {
        try {
          const tables = await dynamodb.listTables().promise();

          if (tables.TableNames.length <= 1) {
            await dynamodb.createTable({
              TableName: "test-table",
              KeySchema: [
                { AttributeName: "pk", KeyType: "HASH" },  //Partition key
                { AttributeName: "sk", KeyType: "RANGE" }  //Sort key
              ],
              AttributeDefinitions: [
                { AttributeName: "pk", AttributeType: "S" },
                { AttributeName: "sk", AttributeType: "S" }
              ],
              ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
              }
            }).promise();
          }
          resolve(true);
        } catch (e) {
          console.error(`Unable to create table Error: ${e.message}`);
          reject(e);
        }
      });
    });

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    dynaliteServer.close();
  })


  it('Create Item', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: "sampleName"
      })
      .expect(201)
      .expect({})
  });

  it('Get item', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .then(res => {

        const { Items, Count, ScannedCount } = res.body;

        expect(Items.length).toEqual(1);
        expect(Count).toEqual(1);
        expect(ScannedCount).toEqual(1);

        const ex = res.body.Items.find(e => e.name === "sampleName")
        expect(!!ex).toBe(true);
        id = ex.pk
      })
  });

  it('Update item', () => {
    return request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({
        name: "newName"
      })
      .expect(200)
      .expect({})
  })

  it('Delete item', () => {
    return request(app.getHttpServer())
      .delete(`/users/${id}`)
      .expect(200)
      .expect({})
  })

  it('Get updated items', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .then(res => {

        const { Items, Count, ScannedCount } = res.body;

        expect(Items.length).toEqual(0);
        expect(Count).toEqual(0);
        expect(ScannedCount).toEqual(0);
      })
  });
});
