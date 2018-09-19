import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil, LoggedInCallback, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst } from '@app/shared';

@Component({
    selector: 'app-awscognito',
    templateUrl: './myprofile.html'
})
export class MyProfileComponent implements LoggedInCallback {

    public parameters: Array<Parameters> = [];
    public cognitoId: String;
    public user: any;

    constructor(
        public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
    }

    async isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.homeLogin}`]);
        } else {
            this.user = await this.userParams.getParameters(true);
            for (let i = 0; i < this.user.length; i++) {
                const parameter = new Parameters();
                parameter.name = this.user[i].getName();
                parameter.value = this.user[i].getValue();
                this.parameters.push(parameter);
            }
            const param = new Parameters();
            param.name = 'cognito ID';
            param.value = this.cognitoUtil.getCognitoIdentity();
            this.parameters.push(param);
        }
    }
}

export class Parameters {
    name: string;
    value: string;
}
