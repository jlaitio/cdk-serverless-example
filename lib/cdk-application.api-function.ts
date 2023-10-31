import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

exports.handler = async () => {
    const client = DynamoDBDocumentClient.from(new DynamoDBClient());
    const result = await client.send(new QueryCommand({
        TableName: 'hello-service-data',
        IndexName: 'hello-service-data-gsi-type-date',
        KeyConditionExpression: "#type = :type",
        ExpressionAttributeNames: {
          "#type": "type",
        },
        ExpressionAttributeValues: {
          ":type": 'hello',
        },
        ScanIndexForward: false,
        Limit: 3,
    }))

    return buildResponseBody(200, JSON.stringify(result.Items));
};

const buildResponseBody = (status: number, body: string, headers = {}) => {
    return {
        statusCode: status,
        headers,
        body,
    };
};