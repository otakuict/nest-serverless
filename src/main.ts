// src/lambda.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { Handler, Context, Callback, APIGatewayProxyEvent } from 'aws-lambda';

let cachedHandler: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

// Lambda entry point
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(event, context, callback);
};
