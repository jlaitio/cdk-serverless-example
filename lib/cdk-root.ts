import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from 'constructs';
import {CdkApplicationStack} from './cdk-application';

export interface PersistenceStackProps extends cdk.NestedStackProps {
  dynamoTable: cdk.aws_dynamodb.TableV2;
}

export class CdkServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Step 3: DynamoDB table as a persistence, rights for the lambdas to use this table
    const table = new cdk.aws_dynamodb.TableV2(this, 'hello-service-data', {
      tableName: 'hello-service-data',
      partitionKey: { name: 'id', type: cdk.aws_dynamodb.AttributeType.STRING },
      globalSecondaryIndexes: [
        {
          indexName: 'hello-service-data-gsi-type-date',
          partitionKey: { name: 'type', type: cdk.aws_dynamodb.AttributeType.STRING },
          sortKey: { name: 'date', type: cdk.aws_dynamodb.AttributeType.STRING }
        },
      ],
      dynamoStream: cdk.aws_dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });
    const dynamodbAccessPolicy = new cdk.aws_iam.Policy(this, 'hello-dynamodb-access', {
      statements: [
        new cdk.aws_iam.PolicyStatement({
          actions: ['dynamodb:*'],
          resources: ['arn:aws:dynamodb:*:*:table/hello-service-*']
        })
      ]
    })


    new CdkApplicationStack(this, "cdk-application", {dynamoTable: table})
    
    // Step 4: scheduled lambda ddb write
    // Step 5: api lambda ddb read & return
    // Step 6: DDB stream lambda
    // Step 7: DDB stream lambda SNS push notification
  }
}
