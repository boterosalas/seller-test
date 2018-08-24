import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import { InformationToForm, SearchFormEntity } from '@shared/models/order.model';
import { ComponentsService } from '@shared/services/components.service';
import { EventEmitterOrders } from '@shared/services/eventEmitter-orders.service';
import { SupportModalComponent } from '@secure/support-modal/support-modal.component';

import { Callback, LoggedInCallback, UserLoginService, UserParametersService } from '../aws-cognito';
import { Logger } from '../util/logger.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ModalComponent } from './modal/modal.component';

// log component
const log = new Logger('ShellComponent');

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})

export class ShellComponent implements OnInit, LoggedInCallback, Callback {

  public showHeader: boolean;
  public user: any;

  /* SideMenu de la aplicación */
  @ViewChild('sidenav') sidenav: MatSidenav;

  /* Sidenav de busqueda de órdenes */
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
    public eventEmitterOrders: EventEmitterOrders,
    public userServiceCognito: UserLoginService,
    public userParams: UserParametersService
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
      this.getDataUser();
    } else if (!isLoggedIn) {
      this.showHeader = false;
      this.viewToolbarPrincipal = false;
    }
  }

  callback() { }

  getDataUser() {
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
  }
  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof SidebarComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
    // this.loadingComponent.viewLoadingProgressBar();
  }

  /**
  * Funcionalidad que permite desplegar el menú de filtro de órdenes.
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
