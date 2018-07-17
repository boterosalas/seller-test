/* 3rd party components */
import { Component, OnInit, Input } from '@angular/core';

/* our own custom components */
import { environment } from '../../../../environments/environment';
import { ShellComponent } from '../shell.component';
import { Logger } from '../../utils/logger.service';
import { User } from '../../../../shared/models/login.model';
import { CognitoUtil, LoggedInCallback } from '../../../../service/cognito.service';
import { FAKE } from '../../utils/fakeData.model';
import { RoutesConst } from '../../../../shared/util/routes.constants';
import { UserLoginService } from '../../../../service/user-login.service';

// log component
const log = new Logger('HeaderComponent');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, LoggedInCallback {

  // booleano para visualizar la barra de toolbar
  @Input() viewToolbarPrincipal: boolean;
  // Información del usuario
  @Input() user: any;
  // Sidenav principal
  @Input() sidenav;
  // Url que se emplea para acceder a el atributo del usuario que se arma con un nombre de url
  public webUrl = environment.webUrl;
  public userLoggin: boolean;
  public sellerName: any;
  public sellerId: any;
  public routes: any;
  /**
   * Creates an instance of HeaderComponent.
   * @param {ShellComponent} shellComponent
   * @memberof HeaderComponent
   */
  constructor(
    public shellComponent: ShellComponent,
    public cognitoUtil: CognitoUtil,
    public userService: UserLoginService
  ) {
    this.user = {};
  }


  /**
   * @memberof HeaderComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
      this.routes = RoutesConst;
    }
  }

  /**
   * Funcionalidad encargada de traer la información del usuario que se encuentra almacenada en localstorage.
   * @memberof ShellComponent
   */
  getDataUser() {
    this.user['sellerId'] = localStorage.getItem('sellerId');
    this.user['sellerProfile'] = localStorage.getItem('sellerProfile');
    this.user['sellerName'] = localStorage.getItem('sellerName');
    this.user['sellerNit'] = localStorage.getItem('sellerNit');
    this.user['sellerEmail'] = localStorage.getItem('sellerEmail');
  }

  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof HeaderComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
    log.info('Sidenav toggle');
  }

}
