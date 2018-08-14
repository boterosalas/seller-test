import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    CognitoCallback,
    UserLoginService,
    RoutesConst
} from '@app/shared';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-awscognito',
    templateUrl: './forgotPassword.html',
    // templateUrl: './forgotPasswordStep2.html',
    styleUrls: ['./forgotPassword.component.scss'],
    animations: [
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
export class ForgotPasswordStep1Component implements CognitoCallback, OnInit {
    // Contiene la estructura del formulario del forgot password
    awscognitogroup: FormGroup;
    email: string;
    errorMessage: string;

    constructor(
        public router: Router,
        public userService: UserLoginService,
        private fb: FormBuilder
    ) {
        this.errorMessage = null;
    }

    onNext() {
        this.errorMessage = null;
        this.userService.forgotPassword(this.email, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message == null && result == null) { // error
            this.router.navigate([`/${RoutesConst.homeForgotPassword}`, this.email]);
        } else { // success
            this.errorMessage = message;
        }
    }
    ngOnInit() {
        this.createForm();
        this.errorMessage = null;
    }

    /**
    * Estructura para los datos del formulario de recuperar contraseña.
    * @memberof LoginComponent
    */
    createForm() {
        this.awscognitogroup = this.fb.group({
            'email': [null, [Validators.required, Validators.email, Validators.maxLength(30)]]
            // 'password': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
        });
    }
}


@Component({
    selector: 'app-awscognito',
    templateUrl: './forgotPasswordStep2.html',
    styleUrls: ['./forgotPassword.component.scss'],
    animations: [
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
export class ForgotPassword2Component implements CognitoCallback, OnInit, OnDestroy {
    // Contiene la estructura del formulario del forgot password
    confirmNewPassword: FormGroup;
    verificationCode: string;
    email: string;
    newPassword: string;
    newPassword2: string;
    errorMessage: string;
    private sub: any;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public userService: UserLoginService,
        private fb: FormBuilder
    ) {
        console.log('email from the url: ' + this.email);
    }

    ngOnInit() {
        this.createForm();
        this.sub = this.route.params.subscribe(params => {
            this.email = params['email'];

        });
        this.errorMessage = null;
    }

    /**
    * Estructura para los datos del formulario de confirmación de nueva contraseña.
    * @memberof LoginComponent
    */
    createForm() {
        this.confirmNewPassword = this.fb.group({
            'verificationCode': [null, [Validators.required, Validators.maxLength(10)]],
            'newPassword': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(25)])],
            // 'newPassword2': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(25)])]
            'newPassword2': new FormControl('', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(25)
            ])
        });
    }

    confirmNewPass(param) {
        if ((this.newPassword !== '' && this.newPassword !== undefined) &&
            (this.newPassword2 !== '' && this.newPassword2 !== undefined)) {
            if (this.newPassword !== this.newPassword2) {
                this.confirmNewPassword.controls[param].setErrors({ 'passNoMatch': true});
            }
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onNext() {
        this.errorMessage = null;
        this.userService.confirmNewPassword(this.email, this.verificationCode, this.newPassword, this);
    }

    cognitoCallback(message: string) {
        if (message != null) { // error
            this.errorMessage = message;
            console.log('result: ' + this.errorMessage);
        } else { // success
            this.router.navigate([`/${RoutesConst.homeLogin}`]);
        }
    }

}
