import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("src"),
      handler: "hello.handler",
    });

    const api = new apigateway.RestApi(this, "hello-api", {
      restApiName: "Hello API",
    });

    const helloIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", helloIntegration); // GET /
  }
}
