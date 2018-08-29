import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Callback, ChallengeParameters, CognitoCallback, DynamoDBService, LoggedInCallback, UserLoginService, UserParametersService } from '@app/core';
import { ShellComponent } from '@app/core/shell/shell.component';
import { HomeComponent } from '@app/public';
import { RoutesConst } from '@app/shared';
import { environment } from '@env/environment';


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
  // Define si la app esta en un entorno de producción.
  isProductionEnv = environment.production;
  public consts = RoutesConst;
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

  constructor(public router: Router,
    public ddb: DynamoDBService,
    public userService: UserLoginService,
    private fb: FormBuilder,
    public shell: ShellComponent,
    private homeComponent: HomeComponent,
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
    this.homeComponent.loadingComponent.closeLoadingProgressBar();
    this.userService.authenticate(this.email, this.password, this);
    this.homeComponent.loadingComponent.viewLoadingSpinner();
  }

  cognitoCallback(message: string, result: any) {
    if (message != null) { // error
      this.homeComponent.loadingComponent.closeLoadingSpinner();
      this.errorMessage = message;
      console.log('result: ' + this.errorMessage);
      if (this.errorMessage === 'User is not confirmed.') {
        this.router.navigate([`/${this.consts.homeConfirmRegistration}`, this.email]);
      } else if (this.errorMessage === 'User needs to set password.') {
        console.log('redirecting to set new password');
        this.router.navigate([`/${this.consts.homeNewPassword}`]);
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
    this.homeComponent.loadingComponent.closeLoadingSpinner();
    if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${this.consts.sellerCenterOrders}`]);
    } else if (this.user.sellerProfile === 'administrator') {
      this.router.navigate([`/${this.consts.sellerCenterIntSellerRegister}`]);
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
      this.router.navigate([`/${this.consts.securehome}`]);
    }
  }

  cancelMFA(): boolean {
    this.mfaStep = false;
    return false;   // necessary to prevent href navigation
  }

  /**
   * Método para visualizar el log de errores.
   *
   * @param {*} [err]
   * @memberof LoginComponent
   */
  viewErrorMessageLogin(err?) {
    this.homeComponent.loadingComponent.closeLoadingProgressBar();
  }
}
