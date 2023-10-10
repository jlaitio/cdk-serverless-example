const crypto = require('crypto');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

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