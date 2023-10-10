import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from 'constructs';

export class CdkServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Step 1: API Lambda placeholder (hello world) with API endpoint
    const apiLambda = new lambda.Function(this, "ApiHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("src"),
      handler: "hello.handler",
    });

    const api = new apigateway.RestApi(this, "hello-api", {
      restApiName: "Hello API",
    });

    const helloIntegration = new apigateway.LambdaIntegration(apiLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", helloIntegration); // GET /

    // Step 2: Scheduled lambda placeholder (hello world) with schedule rule
    const scheduledLambda = new lambda.Function(this, "ScheduledHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("src"),
      handler: "helloSchedule.handler",
    });
    const scheduledRule = new cdk.aws_events.Rule(this,'scheduledLambdaScheduleRule', {
      description: "",
      targets: [ new cdk.aws_events_targets.LambdaFunction(scheduledLambda) ],
      schedule: cdk.aws_events.Schedule.rate(cdk.Duration.minutes(10)),
    });

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
    });
    const dynamodbAccessPolicy = new cdk.aws_iam.Policy(this, 'hello-dynamodb-access', {
      statements: [
        new cdk.aws_iam.PolicyStatement({
          actions: ['dynamodb:*'],
          resources: ['arn:aws:dynamodb:*:*:table/hello-service-*']
        })
      ]
    })
    scheduledLambda.role?.attachInlinePolicy(dynamodbAccessPolicy);
    apiLambda.role?.attachInlinePolicy(dynamodbAccessPolicy);

    // Step 4: scheduled lambda ddb write
    // Step 5: api lambda ddb read & return
    // Step 6: DDB stream lambda
    // Step 7: DDB stream lambda SNS push notification
  }
}
