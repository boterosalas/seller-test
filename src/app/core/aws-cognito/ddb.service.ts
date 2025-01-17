import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { Stuff } from '@secure/aws-cognito/useractivity/useractivity.component';
import DynamoDB from 'aws-sdk/clients/dynamodb';


import * as AWS from 'aws-sdk/global';
import { CognitoUtil } from './cognito.service';

// Constantes de cognito
const cognitoEnv = environment.cognito;

/**
 * Created by Vladimir Budilov
 */
@Injectable()
export class DynamoDBService {

  constructor(public cognitoUtil: CognitoUtil) {
    // constructor of DynamoDBService
  }

  getAWS() {
    return AWS;
  }

  getLogEntries(mapArray: Array<Stuff>) {
    // DynamoDBService: reading from DDB with creds - ' + AWS.config.credentials
    const params = {
      TableName: cognitoEnv.ddbTableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': this.cognitoUtil.getCognitoIdentity()
      }
    };

    const clientParams: any = {};
    if (cognitoEnv.dynamodb_endpoint) {
      clientParams.endpoint = cognitoEnv.dynamodb_endpoint;
    }
    const docClient = new DynamoDB.DocumentClient(clientParams);
    docClient.query(params, onQuery);

    function onQuery(err: any, data: any) {
      if (err) {
        console.error('DynamoDBService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
      } else {
        // print all the movies
        // DynamoDBService: Query succeeded
        data.Items.forEach(function (logitem: any) {
          mapArray.push({ type: logitem.type, date: logitem.activityDate });
        });
      }
    }
  }

  writeLogEntry(type: string) {
    try {
      const date = new Date().toString();
      // tslint:disable-next-line:max-line-length
      // DynamoDBService: Writing log entry. Type:' + type + ' ID: ' + this.cognitoUtil.getCognitoIdentity() + ' Date: ' + date
      this.write(this.cognitoUtil.getCognitoIdentity(), date, type);
    } catch (exc) {
      // 'DynamoDBService: Couldnt write to DDB
    }

  }

  write(data: string, date: string, type: string): void {
    // DynamoDBService: writing ' + type + ' entry'

    const clientParams: any = {
      params: { TableName: cognitoEnv.ddbTableName }
    };
    if (cognitoEnv.dynamodb_endpoint) {
      clientParams.endpoint = cognitoEnv.dynamodb_endpoint;
    }
    const DDB = new DynamoDB(clientParams);

    // Write the item to the table
    const itemParams = {
      TableName: cognitoEnv.ddbTableName,
      Item: {
        userId: { S: data },
        activityDate: { S: date },
        type: { S: type }
      }
    };
    DDB.putItem(itemParams, function (result: any) {
      // DynamoDBService: wrote entry: ' + JSON.stringify(result)
    });
  }

}
