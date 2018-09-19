import { Injectable } from '@angular/core';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as awsservice from 'aws-sdk/lib/service';
import * as CognitoIdentity from 'aws-sdk/clients/cognitoidentity';
import { environment } from '@env/environment';
import { Logger } from '../util/logger.service';

const log = new Logger('CognitoService');

// Constantes de cognito
const cognitoEnv = environment.cognito;

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;

  handleMFAStep?(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void;
}

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface ChallengeParameters {
  CODE_DELIVERY_DELIVERY_MEDIUM: string;

  CODE_DELIVERY_DESTINATION: string;
}

export interface Callback {
  callback(): void;

  callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {

  public static _REGION = cognitoEnv.region;

  public static _IDENTITY_POOL_ID = cognitoEnv.identityPoolId;
  public static _USER_POOL_ID = cognitoEnv.userPoolId;
  public static _CLIENT_ID = cognitoEnv.clientId;

  public static _POOL_DATA: any = {
    UserPoolId: CognitoUtil._USER_POOL_ID,
    ClientId: CognitoUtil._CLIENT_ID
  };

  public cognitoCreds: AWS.CognitoIdentityCredentials;

  getUserPool() {
    if (cognitoEnv.cognito_idp_endpoint && cognitoEnv.cognito_idp_endpoint !== '') {
      CognitoUtil._POOL_DATA.endpoint = cognitoEnv.cognito_idp_endpoint;
    }
    return new CognitoUserPool(CognitoUtil._POOL_DATA);
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  // AWS Stores Credentials in many ways, and with TypeScript this means that
  // getting the base credentials we authenticated with from the AWS globals gets really murky,
  // having to get around both class extension and unions. Therefore, we're going to give
  // developers direct access to the raw, unadulterated CognitoIdentityCredentials
  // object at all times.
  setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
    this.cognitoCreds = creds;
  }

  getCognitoCreds() {
    return this.cognitoCreds;
  }

  // This method takes in a raw jwtToken and uses the global AWS config options to build a
  // CognitoIdentityCredentials object and store it for us. It also returns the object to the caller
  // to avoid unnecessary calls to setCognitoCreds.

  buildCognitoCreds(idTokenJwt: string) {
    let url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;
    if (cognitoEnv.cognito_idp_endpoint) {
      url = cognitoEnv.cognito_idp_endpoint + '/' + CognitoUtil._USER_POOL_ID;
    }
    const logins: CognitoIdentity.LoginsMap = {};
    logins[url] = idTokenJwt;
    const params = {
      IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID, /* required */
      Logins: logins
    };
    const serviceConfigs = <awsservice.ServiceConfigurationOptions>{};
    if (cognitoEnv.cognito_identity_endpoint && cognitoEnv.cognito_identity_endpoint !== '') {
      serviceConfigs.endpoint = cognitoEnv.cognito_identity_endpoint;
    }
    const creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);
    this.setCognitoCreds(creds);
    return creds;
  }


  getCognitoIdentity(): string {
    return this.cognitoCreds.identityId;
  }

  getAccessToken(callback: Callback): void {
    if (callback == null) {
      // tslint:disable-next-line:no-string-throw
      throw ('CognitoUtil: callback in getAccessToken is null...returning');
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function (err: any, session: any) {
        if (err) {
          log.error('CognitoUtil: Can\'t set the credentials:' + err);
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            // if de session is valid get token and decodification
            callback.callbackWithParam(session.getAccessToken().getJwtToken());
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }

  getIdToken(callback: Callback): void {
    if (callback == null) {
      // tslint:disable-next-line:no-string-throw
      throw ('CognitoUtil: callback in getIdToken is null...returning');
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function (err: any, session: any) {
        if (err) {
          log.error('CognitoUtil: Can\'t set the credentials:' + err);
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getIdToken().getJwtToken());
          } else {
            log.error('CognitoUtil: Got the id token, but the session isn\'t valid');
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }

  }

  getRefreshToken(callback: Callback): void {
    if (callback == null) {
      // tslint:disable-next-line:no-string-throw
      throw ('CognitoUtil: callback in getRefreshToken is null...returning');
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function (err: any, session: any) {
        if (err) {
          log.error('CognitoUtil: Can\'t set the credentials:' + err);
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getRefreshToken());
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }

  }

  refresh(): void {
    this.getCurrentUser().getSession(function (err: any, session: any) {
      if (err) {
        log.error('CognitoUtil: Can\'t set the credentials:' + err);
      } else {
        if (session.isValid()) {
          // 'CognitoUtil: refreshed successfully';
        } else {
          log.error('CognitoUtil: refreshed but session is still not valid');
        }
      }
    });
  }

  public getTokenLocalStorage() {
    const nameDataCognitoPool = 'CognitoIdentityServiceProvider';
    const userPool = this.getUserPool();

    const nameLocalStorate = nameDataCognitoPool.concat('.').concat(cognitoEnv.clientId);
    const lastUserActivity = userPool['storage'][nameLocalStorate.concat('.LastAuthUser')];
    const nameLocalStareIdToken = nameLocalStorate.concat('.').concat(lastUserActivity).concat('.').concat('idToken');

    const idToken = userPool['storage'][nameLocalStareIdToken];
    return idToken;
  }
}
