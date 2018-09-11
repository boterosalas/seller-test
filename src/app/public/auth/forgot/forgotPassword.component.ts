import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CognitoCallback, DynamoDBService, UserLoginService, UserParametersService, LoadingService } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { RoutesConst } from '@app/shared';
import { Logger } from '@core/util/logger.service';

const log = new Logger('ForgotPasswordComponent');

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
  // Contiene la estructura del formulario del forgot password
  awscognitogroup: FormGroup;
  errorMessage: string;

  /**
   * Creates an instance of ForgotPassword.
   * @param {LoginService} loginService
   * @param {ShellComponent} shellComponent
   */

  constructor(
    public router: Router,
    public userService: UserLoginService,
    public shell: ShellComponent,
    private fb: FormBuilder,
    private loadingService?: LoadingService
  ) {
    this.errorMessage = null;
  }

  /**
   * @method onNext
   * @description Redirect to view with form for set a new password
   * @memberof ForgotPassword
   */
  onNext() {
    this.errorMessage = null;
    this.loadingService.viewSpinner();
    this.userService.forgotPassword(this.awscognitogroup.controls.email.value, this);
  }

  /**
   * @method cognitoCallback
   * @param message
   * @param result
   * @description Handler the response of cognito login service
   * @memberof ForgotPassword
   */
  cognitoCallback(message: string, result: any) {
    if (message == null && result == null) { // error
      this.router.navigate([`/${RoutesConst.homeForgotPassword}`, this.awscognitogroup.controls.email.value]);
    } else { // success
      log.debug(message);
      switch (message) {
        case 'Username/client id combination not found.':
          this.errorMessage = 'Usuario no encontrado';
          break;
        default:
          this.errorMessage = 'Se ha producido un error, por favor intente más tarde.';
      }
      this.loadingService.closeSpinner();
    }
  }

  ngOnInit() {
    this.createForm();
    this.errorMessage = null;
  }

  /**
   * Estructura para los datos del formulario de recuperar contraseña.
   * @method createForm
   * @description Create a form for request change of password with his respective validations
   * @memberof LoginComponent
   */
  createForm() {
    this.awscognitogroup = this.fb.group({
      'email': [null, [Validators.required, Validators.email, Validators.maxLength(50)]]
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
  user: any;
  email: string;
  newPassword: string;
  newPassword2: string;
  errorMessage: string;
  changePassSucces: boolean;
  private sub: any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public userService: UserLoginService,
    public shell: ShellComponent,
    private fb: FormBuilder,
    public ddb: DynamoDBService,
    public userParams: UserParametersService,
    private loadingService?: LoadingService
  ) { }

  ngOnInit() {
    this.createForm();
    this.sub = this.route.params.subscribe(params => {
      this.email = params['email'];

    });
    this.errorMessage = null;
    this.changePassSucces = false;
    this.loadingService.closeSpinner();
  }

  /**
   * Estructura para los datos del formulario de confirmación de nueva contraseña.
   * @memberof LoginComponent
   * @description Structure the values for the confirm new password form
   * @memberof ForgotPassword
   */
  createForm() {
    this.confirmNewPassword = this.fb.group({
      'verificationCode': [null, [Validators.required, Validators.maxLength(10)]],
      'newPassword': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(25)])],
      'newPassword2': new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(25)
      ])
    });
  }

  /**
   * @method confirmNewPass
   * @param param
   * @description Valid if the both entries for a new password are the same
   * @memberof ForgotPassword
   */
  confirmNewPass(param: any) {
    if ((this.confirmNewPassword.controls.newPassword.value !== '' && this.confirmNewPassword.controls.newPassword.value !== undefined) &&
      (this.confirmNewPassword.controls.newPassword2.value !== '' && this.confirmNewPassword.controls.newPassword2.value !== undefined)) {
      if (this.confirmNewPassword.controls.newPassword.value !== this.confirmNewPassword.controls.newPassword2.value) {
        this.confirmNewPassword.controls[param].setErrors({ 'passNoMatch': true });
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onNext() {
    this.errorMessage = null;
    this.loadingService.viewSpinner();
    this.userService.confirmNewPassword(this.email, this.confirmNewPassword.controls.verificationCode.value, this.confirmNewPassword.controls.newPassword.value, this);
  }

  /**
   * @method cognitoCallback
   * @param message
   * @description Handle the response of cognito login service
   * @memberof ForgotPassword
   */
  cognitoCallback(message: string) {
    if (message != null) { // error
      log.error('result: ' + message);
      switch (message) {
        case '1 validation error detected: Value at \'password\' failed to satisfy constraint: Member must have length greater than or equal to 6': // Pass menor a 6
          this.errorMessage = 'La contraseña debe contener por lo menos una letra, un número y un símbolo y debe contener por lo menos 7 caracteres.';
          break;
        case 'Password does not conform to policy: Password must have lowercase characters': // Debe tener minusculas
          this.errorMessage = 'La contraseña debe contener por lo menos una letra, un número y un símbolo y debe contener por lo menos 7 caracteres.';
          break;
        case 'Password does not conform to policy: Password must have uppercase characters': // Debe tener mayúsculas
          this.errorMessage = 'La contraseña debe contener por lo menos una letra, un número y un símbolo y debe contener por lo menos 7 caracteres.';
          break;
        case 'Password does not conform to policy: Password must have symbol characters': // Debe tener caracteres especiales
          this.errorMessage = 'La contraseña debe contener por lo menos una letra, un número y un símbolo y debe contener por lo menos 7 caracteres.';
          break;
        case 'Invalid verification code provided, please try again.':
          this.errorMessage = 'El código de verificación no es válido, por favor intente de nuevo.';
          break;
        default:
          this.errorMessage = 'Se ha producido un error, por favor intente más tarde.';
      }
      this.loadingService.closeSpinner();
    } else if (this.changePassSucces) { // success
      this.ddb.writeLogEntry('login');
      this.getDataUser();
    } else {
      this.changePassSucces = !this.changePassSucces;
      this.userService.authenticate(this.email, this.confirmNewPassword.controls.newPassword.value, this);
    }
  }

  /**
   * @method getDataUser
   * @description Get the data of user when this make login
   * @memberof ForgotPassword
   */
  getDataUser() {
    this.user = this.userParams.getUserData();
    this.shell.user = this.user;
    this.loadingService.closeSpinner();
    if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
      this.shell.showHeader = true;
    } else if (this.user.sellerProfile === 'administrator') {
      this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
    }
  }
}
