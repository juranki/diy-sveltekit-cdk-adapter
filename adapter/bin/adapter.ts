#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AdapterStack } from '../lib/adapter-stack';

const app = new cdk.App();
new AdapterStack(app, 'AdapterStack', {
  env: { 
    account: process.env.ACCOUNT, 
    region: process.env.REGION,
  },
  serverPath: process.env.SERVER_PATH!,
  staticPath: process.env.STATIC_PATH!,
});
