import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    UserLoginService,
    ChallengeParameters,
    CognitoCallback,
    LoggedInCallback,
    Callback,
    UserParametersService,
    RoutesConst,
    DynamoDBService
 } from '@app/shared';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShellComponent } from '@app/core/shell/shell.component';

@Component({
    selector: 'app-awscognito',
    templateUrl: './login.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        trigger('shrinkOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.5s ease-in')
            ]),
            transition('* => void', [
                animate('0.5s 0.1s ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ]),
        trigger('scaleEfect', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.2s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 0.1s ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit, Callback {
    // Contiene la estructura del formulario del login
    awscognitogroup: FormGroup;
    // Variables del uso de aws-cognito
    email: string;
    password: string;
    errorMessage: string;
    mfaStep = false;
    mfaData = {
        destination: '',
        callback: null
    };

    public user: any;
    /**
     * Creates an instance of LoginComponent.
     * @param {FormBuilder} fb
     * @param {ActivatedRoute} route
     * @param {Router} router
     * @param {ComponentsService} componentService
     * @param {UserService} userService
     * @param {LoginService} loginService
     * @param {ShellComponent} shellComponent
     * @memberof LoginComponent
     */
    constructor(public router: Router,
        public ddb: DynamoDBService,
        public userService: UserLoginService,
        private fb: FormBuilder,
        public shell: ShellComponent,
        public userParams: UserParametersService) {
        this.userService.isAuthenticated(this);
        this.user = {};
    }

    ngOnInit() {
        this.createForm();
        this.errorMessage = null;
    }

    /**
    * Estructura para los datos del formulario de login.
    * @memberof LoginComponent
    */
    createForm() {
        this.awscognitogroup = this.fb.group({
            'email': [null, [Validators.required, Validators.email]],
            'password': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
        });
    }

    onLogin() {
        if (this.email == null || this.password == null) {
            this.errorMessage = 'Todos los campos son requeridos.';
            return;
        }
        this.errorMessage = null;
        this.shell.loadingComponent.closeLoadingProgressBar();
        console.log('LoginComponent');
        this.userService.authenticate(this.email, this.password, this);
        this.shell.loadingComponent.viewLoadingSpinner();
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { // error
            this.shell.loadingComponent.closeLoadingSpinner();
            this.errorMessage = message;
            console.log('result: ' + this.errorMessage);
            if (this.errorMessage === 'User is not confirmed.') {
                this.router.navigate([`/${RoutesConst.homeConfirmRegistration}`, this.email]);
            } else if (this.errorMessage === 'User needs to set password.') {
                console.log('redirecting to set new password');
                this.router.navigate([`/${RoutesConst.homeNewPassword}`]);
            }
        } else { // success
            this.ddb.writeLogEntry('login');
            this.shell.showHeader = true;
            this.getDataUser();
        }
    }

    callback() { }

    getDataUser() {
        this.userParams.getUserData(this);
    }

    callbackWithParam(userData: any) {
        this.user = userData;
        this.shell.user = this.user;
        this.shell.loadingComponent.closeLoadingSpinner();
        if (this.user.sellerProfile === 'seller') {
            this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
        } else if (this.user.sellerProfile === 'administrator') {
            this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
        }
    }

    handleMFAStep(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
        this.mfaStep = true;
        this.mfaData.destination = challengeParameters.CODE_DELIVERY_DESTINATION;
        this.mfaData.callback = (code: string) => {
            if (code == null || code.length === 0) {
                this.errorMessage = 'Code is required';
                return;
            }
            this.errorMessage = null;
            callback(code);
        };
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.router.navigate([`/${RoutesConst.securehome}`]);
        }
    }

    cancelMFA(): boolean {
        this.mfaStep = false;
        return false;   // necessary to prevent href navigation
    }

    /**
 * Método para visualizar el log de errores
 * @param {any} [err]
 * @memberof LoginComponent
 */
    viewErrorMessageLogin(err?) {
        this.shell.loadingComponent.closeLoadingProgressBar();
    }
}
