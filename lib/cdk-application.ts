import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from 'constructs';
import { PersistenceStackProps } from './cdk-root';

export class CdkApplicationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PersistenceStackProps) {
    super(scope, id, props);
    const { dynamoTable } = props;

    // Step 1: API Lambda placeholder with API endpoint
    const apiLambda = new NodejsFunction(this, "api-function");

    const api = new apigateway.RestApi(this, "hello-api", {
      restApiName: "Hello API",
    });
    const helloIntegration = new apigateway.LambdaIntegration(apiLambda);
    api.root.addMethod("GET", helloIntegration); // GET /

    // Step 2: Scheduled lambda placeholder with schedule rule
    const scheduledLambda = new NodejsFunction(this, "scheduled-function");
    const scheduledRule = new cdk.aws_events.Rule(this, 'scheduled-function-schedule-rule', {
      description: "",
      targets: [ new cdk.aws_events_targets.LambdaFunction(scheduledLambda) ],
      schedule: cdk.aws_events.Schedule.rate(cdk.Duration.minutes(10)),
    });

    dynamoTable.grantReadData(apiLambda);
    dynamoTable.grantReadWriteData(scheduledLambda);

    // Step 4: scheduled lambda ddb write
    // Step 5: api lambda ddb read & return

    // Step 6: DDB stream lambda
    const streamLambda = new NodejsFunction(this, "stream-function");
    const ddbStreamEventSource = new lambda.CfnEventSourceMapping(this, "stream-function-dynamodb-stream-event-source", {      
      functionName: streamLambda.functionName,
      eventSourceArn: dynamoTable.tableStreamArn,
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
    });

    dynamoTable.grantStreamRead(streamLambda);

    // Step 7: DDB stream lambda SNS push notification
  }
}
