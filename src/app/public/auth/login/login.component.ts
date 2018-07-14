import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginService } from '../../../service/user-login.service';
import { ChallengeParameters, CognitoCallback, LoggedInCallback } from '../../../service/cognito.service';
import { DynamoDBService } from '../../../service/ddb.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewContainerRef } from '@angular/core';
import { ShellComponent } from '../../../secure/seller-center/shell/shell.component';

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
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {
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
        private shellComponent: ShellComponent) {
    }

    ngOnInit() {
        this.createForm();
        this.errorMessage = null;
        this.userService.isAuthenticated(this);
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
        // this.shellComponent.loadingComponent.viewLoadingProgressBar();
        if (this.email == null || this.password == null) {
            this.errorMessage = 'Todos los campos son requeridos.';
            return;
        }
        this.errorMessage = null;
        // this.shellComponent.loadingComponent.closeLoadingProgressBar();
        this.userService.authenticate(this.email, this.password, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { // error
            this.errorMessage = message;
            console.log('result: ' + this.errorMessage);
            if (this.errorMessage === 'User is not confirmed.') {
                this.router.navigate(['/home/confirmRegistration', this.email]);
            } else if (this.errorMessage === 'User needs to set password.') {
                console.log('redirecting to set new password');
                this.router.navigate(['/home/newPassword']);
            }
        } else { // success
            this.ddb.writeLogEntry('login');
            this.router.navigate(['/securehome']);
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
            this.router.navigate(['/securehome']);
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
        this.shellComponent.loadingComponent.closeLoadingProgressBar();
        // this.componentService.openSnackBar('Se ha presentado un error al iniciar sesión', 'Aceptar');
    }
}
