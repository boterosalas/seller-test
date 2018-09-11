import { Injectable } from '@angular/core';
import { CognitoUtil } from './cognito.service';
import { UserInformation } from '@app/shared/models';
import { Logger } from '../util/logger.service';

const log = new Logger('UserParametersService');

@Injectable()
export class UserParametersService {
    private cognitoUser: any;
    private user: UserInformation;

    constructor(public cognitoUtil: CognitoUtil) {
        this.user = new UserInformation();
        if (this.cognitoUtil.getCurrentUser()) {
            this.getParameters();
        }
    }

    getUserData(): UserInformation {
        return this.user;
    }

    async getParameters(onlyAttributes?: any) {
        this.cognitoUser = await this.cognitoUtil.getCurrentUser();
        const attributes = await this.getAttributes();
        if (onlyAttributes) {
            return attributes;
        }
        for (let i = 0; i < attributes.length; i++) {
            switch (attributes[i].getName()) {
                case 'custom:SellerId':
                    this.user.sellerId = attributes[i].getValue();
                    break;
                case 'custom:Roles':
                    this.user.sellerProfile = attributes[i].getValue();
                    break;
                case 'name':
                    this.user.sellerName = attributes[i].getValue();
                    break;
                case 'custom:Nit':
                    this.user.sellerNit = attributes[i].getValue();
                    break;
                case 'email':
                    this.user.sellerEmail = attributes[i].getValue();
                    break;
            }
        }
    }

    private async getAttributes(): Promise<any> {
        await this.getSession();
        return new Promise((resolve, reject) => {
            this.cognitoUser.getUserAttributes((err: any, result: any) => {
                if (err) {
                    log.error('UserParametersService: in getParameters: ' + err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

    }

    private getSession(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cognitoUser.getSession((err: any, res: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

    }
}
