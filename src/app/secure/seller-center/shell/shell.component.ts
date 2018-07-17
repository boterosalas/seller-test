/* 3rd party components */
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { Router, NavigationStart } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

/* our own custom components */
import { LoadingComponent } from './loading/loading.component';
import { ModalComponent } from './modal/modal.component';
import { Logger } from '../utils/logger.service';
import { User } from '../../../shared/models/login.model';
import { SearchFormEntity, InformationToForm } from '../../../shared/models/order';
import { UserService } from '../utils/services/common/user/user.service';
import { ComponentsService } from '../utils/services/common/components/components.service';
import { EventEmitterOrders } from '../utils/event/eventEmitter-orders.service';
import { SupportModalComponent } from '../components/support-modal/support-modal.component';
import { LoggedInCallback } from '../../../service/cognito.service';
import { UserLoginService } from '../../../service/user-login.service';
import { HeaderComponent } from './header/header.component';
// log component
const log = new Logger('ShellComponent');

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})

export class ShellComponent implements OnInit, LoggedInCallback {

  public showHeader: boolean;
  public user: any;

  /* SideMenu de la aplicación */
  @ViewChild('sidenav') sidenav: MatSidenav;

  /* Sidenav de busqueda de ordenes */
  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;

  /* Loading de la pagina */
  @ViewChild('loadingComponent') loadingComponent: LoadingComponent;

  /* Modal de la página */
  @ViewChild('modalComponent') modalComponent: ModalComponent;

  /* Variable que permite cambiar el estado del sidenav */
  stateSideNav = false;
  stateSideNavOrder = false;

  /* booleano para visualizar la barra de toolbar */
  public viewToolbarPrincipal: boolean;

  /* Variable que permite saber cual formulario de filtro desplegar
  en el menú de filtro y que información se le pasar a este mismo */
  informationToForm: SearchFormEntity = {
    title: 'Buscar',
    btn_title: 'Buscar',
    title_for_search: 'Buscar',
    type_form: 'orders',
    information: new InformationToForm
  };

  userLoggin: boolean;


  /**
   * Creates an instance of ShellComponent.
   * @param {MatDialog} dialog
   * @param {UserService} userService
   * @param {ComponentsService} componentservice
   * @param {Router} router
   * @param {EventEmitterOrders} eventEmitterOrders
   * @memberof ShellComponent
   */

  constructor(
    public dialog: MatDialog,
    public componentservice: ComponentsService,
    private router: Router,
    public eventEmitterOrders: EventEmitterOrders,
    public userServiceCognito: UserLoginService
  ) {
    this.user = {};
  }

  /**
   * @memberof ShellComponent
   */
  ngOnInit() {
    this.userServiceCognito.isAuthenticated(this);
  }

  /**
   * @method Metodo para validar si el usuario esta logeado
   * @param message
   * @param isLoggedIn
   * @memberof ShellComponent
   */
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.viewToolbarPrincipal = true;
      this.showHeader = true;
      this.getUser();
    } else if (!isLoggedIn) {
      this.showHeader = false;
      this.viewToolbarPrincipal = false;
      this.router.navigate(['/home']);
    }
  }

  getUser() {
    this.user['sellerId'] = localStorage.getItem('sellerId');
    this.user['sellerProfile'] = localStorage.getItem('sellerProfile');
    this.user['sellerName'] = localStorage.getItem('sellerName');
    this.user['sellerNit'] = localStorage.getItem('sellerNit');
    this.user['sellerEmail'] = localStorage.getItem('sellerEmail');
  }
  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof SidebarComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
    log.info('Sidenav toggle');
    // this.loadingComponent.viewLoadingProgressBar();
  }

  /**
  * Funcionalidad que permite desplegar el menú de filtro de ordenes.
  * @memberof SidebarComponent
  */
  toggleMenuSearchOrder(informationToForm: SearchFormEntity) {
    this.sidenavSearchOrder.toggle();
    this.informationToForm = informationToForm;
    log.info('Sidenav Search order menu toggle', `type_form ${informationToForm.type_form}`);
  }

  /**
   * Funcionalidad para desplegar el modal que permite hacer el envío de todos los productos de una orden.
   * @memberof ShellComponent
   */
  openDialogSupport(): void {
    // this.loadingComponent.viewLoadingProgressBar();
    const dialogRef = this.dialog.open(SupportModalComponent, {
      width: '90%',
      panelClass: 'full-width-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The dialog SupportModalComponent was closed');
      this.loadingComponent.closeLoadingProgressBar();
    });
  }

  /**
   * Funcionalidad que permite redirigir a Envios Éxito con el acceso de token para poder ingresar automaticamente.
   * @memberof ShellComponent
   */
  goToEnviosExito() {
    const url = `https://envios.exito.com/token/${this.user.access_token}`;
    // window.location.href = url;
    window.open(url);
  }
}
