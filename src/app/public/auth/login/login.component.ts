import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ChallengeParameters, CognitoCallback, DynamoDBService, LoadingService, LoggedInCallback, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst, UserInformation } from '@app/shared';
import { environment } from '@env/environment';
import { Logger } from '@core/util/logger.service';

const log = new Logger('LoginComponent');

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
  // Define si la app esta en un entorno de producción.
  isProductionEnv = environment.production;
  public consts = RoutesConst;
  // Variables del uso de aws-cognito
  errorMessage: string;
  mfaStep = false;
  mfaData = {
    destination: '',
    callback: null
  };
  public user: UserInformation;

  constructor(
    private router: Router,
    private ddb: DynamoDBService,
    private userService: UserLoginService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private userParams: UserParametersService
  ) {
    this.userService.isAuthenticated(this);
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
    if (this.awscognitogroup.controls.email.value == null || this.awscognitogroup.controls.password.value == null) {
      this.errorMessage = 'Todos los campos son requeridos.';
      return;
    }
    this.errorMessage = null;
    this.loadingService.closeProgressBar();
    this.userService.authenticate(this.awscognitogroup.controls.email.value, this.awscognitogroup.controls.password.value, this);
    this.loadingService.viewSpinner();
  }

  public validCorrectMessage(msg: string): string {
    if (msg !== null) {
      switch (msg) {
        case 'Incorrect username or password.': msg = 'Nombre de usuario o contraseña incorrecta';
      }
    }
    return msg;
  }

  async cognitoCallback(message: string, result: any) {
    if (message != null) { // error
      this.loadingService.closeSpinner();
      this.errorMessage = this.validCorrectMessage(message);
      log.error('result: ' + this.errorMessage);
      if (this.errorMessage === 'User is not confirmed.') {
        this.router.navigate([`/${this.consts.homeConfirmRegistration}`, this.awscognitogroup.controls.email.value]);
      } else if (this.errorMessage === 'User needs to set password.') {
        log.error('redirecting to set new password');
        this.router.navigate([`/${this.consts.homeNewPassword}`]);
      }
    } else { // success
      this.ddb.writeLogEntry('login');
      await this.userParams.getParameters();
      this.getDataUser();
    }
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.loadingService.closeSpinner();
    if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${this.consts.sellerCenterIntDashboard}`]);
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
  viewErrorMessageLogin(err?: any) {
    this.loadingService.closeProgressBar();
  }
}
