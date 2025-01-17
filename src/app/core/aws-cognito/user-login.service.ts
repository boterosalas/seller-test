import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AuthenticationDetails, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';

import { EndpointService } from '../http';
import { Logger } from '../util/logger.service';
import { CognitoCallback, CognitoUtil, LoggedInCallback } from './cognito.service';
import { DynamoDBService } from './ddb.service';
// import { AuthService } from '@app/secure/auth/auth.routing';
// import { Behavior } from 'aws-sdk/clients/iot';
import { BehaviorSubject } from 'rxjs';
import STS from 'aws-sdk/clients/sts';

const log = new Logger('UserLoginService');

// Constantes de cognito
const cognitoEnv = environment.cognito;

@Injectable()
export class UserLoginService {

  isLogin$ = new BehaviorSubject(null);

  constructor(
    private ddb: DynamoDBService,
    private cognitoUtil: CognitoUtil,
    private api: EndpointService
  ) { }

  configServerLogs() {
    // Configurar datos del servidor para los logs.
    const token = this.cognitoUtil.getTokenLocalStorage();
    Logger.setServerConfig(this.api.get('setCloudWatchLog'), token);
  }

  private onLoginSuccess(callback: CognitoCallback, session: CognitoUserSession) {

    log.debug('In authenticateUser onSuccess callback');

    const token = session.getIdToken().getJwtToken();
    AWS.config.credentials = this.cognitoUtil.buildCognitoCreds(token);

    // So, when CognitoIdentity authenticates a user, it doesn't actually hand us the IdentityID,
    // used by many of our other handlers. This is handled by some sly underhanded calls to AWS Cognito
    // API's by the SDK itself, automatically when the first AWS SDK request is made that requires our
    // security credentials. The identity is then injected directly into the credentials object.
    // If the first SDK call we make wants to use our IdentityID, we have a
    // chicken and egg problem on our hands. We resolve this problem by "priming" the AWS SDK by calling a
    // very innocuous API call that forces this behavior.
    const clientParams: any = {};
    if (cognitoEnv.sts_endpoint) {
      clientParams.endpoint = cognitoEnv.sts_endpoint;
    }
    const sts = new STS(clientParams);
    sts.getCallerIdentity((err: any, data: any) => {
      log.debug('UserLoginService: Successfully set the AWS credentials');
      // Configurar datos del servidor para los logs.
      this.configServerLogs();
      callback.cognitoCallback(null, session);
    });
  }

  private onLoginError = (callback: CognitoCallback, err) => {
    callback.cognitoCallback(err.message, null);
  }

  /**
   * Metodo de autenticacion de seller-center con aws-cognito
   * @param username correo electronico del usuario
   * @param password contrasena del usuario
   * @param callback pagina a la cual se va redirigir al momento de autenticar
   */
  authenticate(username: string, password: string, callback: CognitoCallback) {
    log.debug('UserLoginService: starting the authentication');

    const authenticationData = {
      Username: username,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    log.debug('UserLoginService: Params set...Authenticating the user');
    const cognitoUser = new CognitoUser(userData);
    log.debug('UserLoginService: config is ' + AWS.config);
    cognitoUser.authenticateUser(authenticationDetails, {
      newPasswordRequired: (userAttributes, requiredAttributes) => callback.cognitoCallback(`User needs to set password.`, null),
      onSuccess: result => this.onLoginSuccess(callback, result),
      onFailure: err => this.onLoginError(callback, err),
      mfaRequired: (challengeName, challengeParameters) => {
        callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
          cognitoUser.sendMFACode(confirmationCode, {
            onSuccess: result => this.onLoginSuccess(callback, result),
            onFailure: err => this.onLoginError(callback, err)
          });
        });
      }
    });
  }

  forgotPassword(username: string, callback: CognitoCallback) {
    const userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: function () {

      },
      onFailure: function (err: any) {
        callback.cognitoCallback(err.message, null);
      },
      inputVerificationCode() {
        callback.cognitoCallback(null, null);
      }
    });
  }

  confirmNewPassword(email: string, verificationCode: string, password: string): Promise<string> {
    return new Promise<string>((resolve) => {
      const userData = {
        Username: email,
        Pool: this.cognitoUtil.getUserPool()
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmPassword(verificationCode, password, {
        onSuccess: () => {
          resolve(null);
        },
        onFailure: (err: any) => {
          resolve(err.message);
        }
      });
    });
  }

  logout() {
    log.debug('UserLoginService: Logging out');
    if (typeof this.cognitoUtil.getCurrentUser() === 'undefined' || this.cognitoUtil.getCurrentUser() === null) {
      return null;
    }
    this.cognitoUtil.getCurrentUser().signOut();
    this.isLogin$.next(false);
  }

  isAuthenticated(callback: LoggedInCallback) {
    if (callback == null) {
      // tslint:disable-next-line:no-string-throw
      throw ('UserLoginService: Callback in isAuthenticated() cannot be null');
    }
    const cognitoUser = this.cognitoUtil.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          log.debug('UserLoginService: Couldn\'t get the session: ' + err, err.stack);
          callback.isLoggedIn(err, false);
        } else {
          // UserLoginService: Session is ' + session.isValid()
          this.configServerLogs();
          callback.isLoggedIn(err, session.isValid());
        }
      });
    } else {
      // UserLoginService: can\'t retrieve the current user
      callback.isLoggedIn('Can\'t retrieve the CurrentUser', false);
    }
  }
}
