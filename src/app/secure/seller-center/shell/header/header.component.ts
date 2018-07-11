/* 3rd party components */
import { Component, OnInit, Input } from '@angular/core';

/* our own custom components */
import { environment } from '../../../../environments/environment';
import { ShellComponent } from '../shell.component';
import { Logger } from '../../utils/logger.service';
import { User } from '../../../../shared/models/login.model';
import { CognitoUtil } from '../../../../service/cognito.service';
import { FAKE } from '../../utils/fakeData.model';

// log component
const log = new Logger('HeaderComponent');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {

  // booleano para visualizar la barra de toolbar
  @Input() viewToolbarPrincipal: boolean;
  // Información del usuario
  @Input() user: User;
  // Sidenav principal
  @Input() sidenav;
  // Url que se emplea para acceder a el atributo del usuario que se arma con un nombre de url
  public webUrl = environment.webUrl;
  userLoggin: boolean;
  sellerName: any;
  sellerId: any;
  /**
   * Creates an instance of HeaderComponent.
   * @param {ShellComponent} shellComponent
   * @memberof HeaderComponent
   */
  constructor(
    public shellComponent: ShellComponent, public cognitoUtil: CognitoUtil
  ) { }


  /**
   * @memberof HeaderComponent
   */
  ngOnInit() {
    this.user = this.user || FAKE.FAKEUSER;
    const token = this.cognitoUtil.getTokenLocalStorage();
    this.userLoggin = false;
    if (typeof token !== 'undefined') {
      this.userLoggin = true;
    }
    this.sellerName = localStorage.getItem('sellerName');
    this.sellerId = localStorage.getItem('sellerId');
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
