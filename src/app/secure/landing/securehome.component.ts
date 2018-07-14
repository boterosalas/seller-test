import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { Callback, LoggedInCallback, CognitoUtil } from '../../service/cognito.service';
import { ShellComponent } from './../seller-center/shell/shell.component';
import { UserParametersService } from '../../service/user-parameters.service';
import { UserService } from '../seller-center/utils/services/common/user/user.service';

@Component({
    selector: 'app-awscognito',
    templateUrl: './secureHome.html'
})

export class SecureHomeComponent implements LoggedInCallback {

    public parameters: any;
    public cognitoId: String;

    // tslint:disable-next-line:max-line-length
    constructor(
        public shell: ShellComponent,
        public userServiceProvider: UserService,
        public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
        this.parameters = {
            sellerId: '',
            sellerProfile: '',
            sellerName: '',
            sellerNit: '',
            sellerEmail: ''
        };
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.shell.showHeader = true;
            this.userParams.getParameters(new GetParametersCallback(this, this.cognitoUtil, this.router));
        }
    }
}

export class GetParametersCallback implements Callback {

    constructor(
        public me: SecureHomeComponent,
        public cognitoUtil: CognitoUtil,
        public router: Router) {

    }

    callback() { }

    callbackWithParam(result: any) {
        for (let i = 0; i < result.length; i++) {
            switch (result[i].getName()) {
                case 'custom:SellerId':
                    this.me.parameters.sellerId = result[i].getValue();
                    break;
                case 'custom:Roles':
                    this.me.parameters.sellerProfile = result[i].getValue();
                    break;
                case 'name':
                    this.me.parameters.sellerName = result[i].getValue();
                    break;
                case 'custom:Nit':
                    this.me.parameters.sellerNit = result[i].getValue();
                    break;
                case 'email':
                    this.me.parameters.sellerEmail = result[i].getValue();
                    break;
            }
        }
        this.me.shell.user = this.me.parameters;
        this.me.userServiceProvider.setUser(this.me.parameters);
        this.router.navigate(['/securehome/seller-center']);
    }
}
