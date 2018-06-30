/* 3rd party components */
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/* our own custom components */
import { Logger } from '../../../../core/utilities/logger.service';
import { User, Login } from '../../../shared/models/login.model';
import { ComponentsService } from '../../../../core/services/common/components/components.service';
import { UserService } from '../../../../core/services/common/user/user.service';
import { LoginService } from '../login.service';
import { ShellComponent } from '../../../../core/shell/shell.component';
import { environment } from './../../../../../environments/environment';
import { OnDestroy } from '@angular/core';

// log component
const log = new Logger('LoginComponent');

/**
 * Componente para realizar el inicio de sesión.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    UserService
  ],
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

/**
 * Componente para realizar el proceso de inicio de sesión
 */
export class LoginComponent implements OnInit, OnDestroy {

  // Contiene la estructura del formulario del login
  myform: FormGroup;
  // Contiene la información del usuario
  user: User;
  // suscription para obtener el token del usuario
  private subTokenUser: any;

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    public componentService: ComponentsService,
    public userService: UserService,
    private loginService: LoginService,
    private shellComponent: ShellComponent
    ) {
  }

  /**
   * @memberof LoginComponent
   */
  ngOnInit() {

    this.validateTokenInURL();
    this.createForm();

    /* Obtengo los datos del usuario */
    this.getDataUser();
    if (this.user.login === true) {
      this.router.navigate(['/seller-center/ordenes']);
    } else {
      log.info('No se posee una sesión activa.');
    }
  }

  /**
   * Evento que permite obtener los parametros pasados por la url y verificar si hay que iniciar sesión automaticamente
   * @memberof LoginComponent
   */
  validateTokenInURL() {
    this.subTokenUser = this.route.params.subscribe(params => {
      const token = params['token'];

      if (token !== undefined) {
        log.info('Se ha obtenido un token por medio de la url', token);
        this.loginGetProfileUser(token);
      } else {
        log.info('No se ha encontrado el token del usuario.');
      }
    });
  }

  /**
   * Estructura para los datos del formulario de login.
   * @memberof LoginComponent
   */
  createForm() {
    this.myform = this.fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],
    });
  }


  /**
   * ngOnDestroy
   * @memberof LoginComponent
   */
  ngOnDestroy() {
    this.subTokenUser.unsubscribe();
  }

  /**
   * Permite obtener el perfil del usuario.
   */
  getDataUser() {
    this.user = this.userService.getUser();
  }

  /**
   * Funcionalidad para realizar el proceso de login.
   * El flujo del proceso es:
   * 1. Obtengo los datos del formulario
   * 2. Armo el objeto json que se enviara al servicio de login
   * 3. De acuerdo a la respuesta muestro mensaje de error o paso a consultar la información del perfil del usuario
   * @param data
   */
  loginUser(data) {

    /* obtengo los datos del formulario de login */
    const userInfo: Login = data.value;
    /* armo el objeto que se enviara al servicio de login */
    const information = {
      grant_type: 'password',
      username: userInfo.username,
      password: userInfo.password,
      scope: 'openid',
      client_id: environment.auth0.client_id,
      client_secret: environment.auth0.client_secret
    };

    /* visualizo el componente loading. */
    this.shellComponent.loadingComponent.viewLoadingProgressBar();

    this.loginService.loginUser(information).subscribe((res: any) => {
      log.info(res);
      this.loginGetProfileUser(res.access_token);
    }, err => {
      this.viewErrorMessageLogin(err);
    });
  }


  /**
   * Funcionalidad para obtener la información del usuario
   * El flujo del proceso es:
   * 1. Obtengo el token del usuario para permitir consultar el perfil
   * 2. De acuerdo a la respuesta muestro mensaje de inicio de sesión o paso a informar que el usuario no posee permisos para la vista.
   * 3. Redirigo al usuario a la vista principal de acuerdo a su rol
   * @param access_token
   */
  loginGetProfileUser(access_token) {
    if (access_token !== undefined) {

      this.userService.getProfileUser(access_token).subscribe((res: any) => {

        /* Validación de permisos */
        if (res != null) {
          log.info(res);

          if (res[environment.webUrl] === undefined) {
            log.error('Los datos del usuario estan malos.');
            this.viewErrorMessageLogin();
          } else {
            /* limpio formulario */
            this.myform.reset();
            this.componentService.openSnackBar('has iniciado sesión con ' + res.name, 'Aceptar');

            /* agrego una variable al objeto del usuario para indicar que se encuentra logeado */
            res.login = true;
            res.access_token = access_token;
            const user = JSON.stringify(res);
            this.userService.setUser(user);
            this.shellComponent.loadingComponent.closeLoadingProgressBar();

            // Aplico el filtro par consultar las ordenes en el estado 35 "Por enviar"
            localStorage.setItem('currentFilter', `idStatusOrder=35`);
            this.router.navigate(['/seller-center/ordenes/estado/35']);
          }
        } else {
          this.viewErrorMessageLogin();
        }
      });
    } else {
      this.viewErrorMessageLogin();
    }
  }

  /**
   * Método para visualizar el log de errores
   * @param {any} [err]
   * @memberof LoginComponent
   */
  viewErrorMessageLogin(err?) {
    this.shellComponent.loadingComponent.closeLoadingProgressBar();
    log.error(err);
    this.componentService.openSnackBar('Se ha presentado un error al iniciar sesión', 'Aceptar');
  }
}
