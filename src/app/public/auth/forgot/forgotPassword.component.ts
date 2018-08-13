import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    CognitoCallback,
    UserLoginService,
    RoutesConst
} from '@app/shared';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-awscognito',
    templateUrl: './forgotPassword.html',
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
    // Contiene la estructura del formulario del login
    awscognitogroup: FormGroup;
    email: string;
    errorMessage: string;

    constructor(public router: Router,
        public userService: UserLoginService,
        private fb: FormBuilder) {
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
    templateUrl: './forgotPasswordStep2.html'
})
export class ForgotPassword2Component implements CognitoCallback, OnInit, OnDestroy {

    verificationCode: string;
    email: string;
    password: string;
    errorMessage: string;
    private sub: any;

    constructor(public router: Router, public route: ActivatedRoute,
        public userService: UserLoginService) {
        console.log('email from the url: ' + this.email);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['email'];

        });
        this.errorMessage = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onNext() {
        this.errorMessage = null;
        this.userService.confirmNewPassword(this.email, this.verificationCode, this.password, this);
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
