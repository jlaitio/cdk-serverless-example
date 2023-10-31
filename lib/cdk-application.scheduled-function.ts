import crypto from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

exports.handler = async () => {
    const data = {
        id: crypto.randomUUID(),
        type: 'hello',
        date: new Date().toISOString(),
    };

    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    await client.send(new PutCommand({
        TableName: 'hello-service-data',
        Item: data,
    }))
    console.log('inserted data', {data});
};