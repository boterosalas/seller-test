import { Injectable } from '@angular/core';
import { Callback, CognitoUtil } from './cognito.service';

@Injectable()
export class UserParametersService {

    constructor(public cognitoUtil: CognitoUtil) {}

    getParameters(callback: Callback) {
        const cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err: any, session: any) {
                if (err) {
                    console.log('UserParametersService: Couldnt retrieve the user');
                } else {
                    // tslint:disable-next-line:no-shadowed-variable
                    cognitoUser.getUserAttributes(function (err: any, result: any) {
                        if (err) {
                            console.log('UserParametersService: in getParameters: ' + err);
                        } else {
                            callback.callbackWithParam(result);
                        }
                    });
                }

            });
        } else {
            callback.callbackWithParam(null);
        }
    }

    getUserData(callback: Callback) {
        const cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err: any, session: any) {
                if (err) {
                    console.log('UserParametersService: Couldnt retrieve the user');
                } else {
                    // tslint:disable-next-line:no-shadowed-variable
                    cognitoUser.getUserAttributes(function (err: any, result: any) {
                        if (err) {
                            console.log('UserParametersService: in getParameters: ' + err);
                        } else {
                            const userData: any = {};
                            for (let i = 0; i < result.length; i++) {
                                switch (result[i].getName()) {
                                    case 'custom:SellerId':
                                        userData['sellerId'] = result[i].getValue();
                                        break;
                                    case 'custom:Roles':
                                        userData['sellerProfile'] = result[i].getValue();
                                        break;
                                    case 'name':
                                        userData['sellerName'] = result[i].getValue();
                                        break;
                                    case 'custom:Nit':
                                        userData['sellerNit'] = result[i].getValue();
                                        break;
                                    case 'email':
                                        userData['sellerEmail'] = result[i].getValue();
                                        break;
                                }
                            }
                            callback.callbackWithParam(userData);
                        }
                    });
                }

            });
        } else {
            callback.callbackWithParam(null);
        }
    }
}
