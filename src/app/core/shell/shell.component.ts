/* 3rd party components */
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { Router, NavigationStart } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

/* our own custom components */
import { LoadingComponent } from './loading/loading.component';
import { Logger } from '../utilities/logger.service';
import { SupportModalComponent } from '../../components/common/support-modal/support-modal.component';
import { User } from '../../components/shared/models/login.model';
import { UserService } from '../services/common/user/user.service';
import { ComponentsService } from '../services/common/components/components.service';
import { EventEmitterOrders } from '../event/eventEmitter-orders.service';
import { SearchFormEntity, InformationToForm } from '../../components/shared/models/order';
import { ModalComponent } from './modal/modal.component';
// log component
const log = new Logger('ShellComponent');

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})

export class ShellComponent implements OnInit {

  // SideMenu de la aplicación
  @ViewChild('sidenav') sidenav: MatSidenav;
  // Sidenav de busqueda de ordenes
  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;
  // Loading de la pagina
  @ViewChild('loadingComponent') loadingComponent: LoadingComponent;
  // Modal de la página
  @ViewChild('modalComponent') modalComponent: ModalComponent;
  // Variable que permite cambiar el estado del sidenav
  stateSideNav = false;
  stateSideNavOrder = false;
  // Información del usuario
  user: User;
  // booleano para visualizar la barra de toolbar
  viewToolbarPrincipal = true;
  // Variable que permite saber cual formulario de filtro desplegar en el menú de filtro y que información se le pasar a este mismo
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
    public userService: UserService,
    public componentservice: ComponentsService,
    private router: Router,
    public eventEmitterOrders: EventEmitterOrders
  ) {
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: NavigationStart) => {
        // You only receive NavigationStart events
        this.getDataUser();
      });
  }

  /**
   * @memberof ShellComponent
   */
  ngOnInit() {
    this.user = this.userService.getUser();
  }

  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof SidebarComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
    log.info('Sidenav toggle');
    this.loadingComponent.viewLoadingProgressBar();
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
    this.loadingComponent.viewLoadingProgressBar();
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

  /**
   * Funcionalidad encargada de traer la información del usuario que se encuentra almacenada en localstorage.
   * @memberof ShellComponent
   */
  getDataUser() {
    this.user = this.userService.getUser();
    if (this.user.login === undefined) {
      this.userService.setUser([]);
    }
  }

  /**
   * Funcionalidad encargada de validar el acceso del usuario en la aplicación
   * @memberof ShellComponent
   */
  validateAccesUser(): Observable<[{}]> {
    return new Observable(observer => {
      this.getDataUser();
      if (this.user.login === true) {
        log.info('Se ha encontrado una sesión activa');
        this.userService.getProfileUser(this.user.access_token).subscribe(res => {
          log.info('Perfil del usuario actual:', res);
          this.viewToolbarPrincipal = true;
          observer.next();
        }, err => {
          log.info('La sesión local ha expirado y se cierra la sesión');
          this.componentservice.openSnackBar('Se ha cerrado la sesión, Ingresa de nuevo', 'Aceptar');

          // clear user information
          this.user = this.userService.getEmptyUser();
          this.userService.setUser(JSON.stringify(this.user));
          this.stateSideNav = false;
          observer.error();
          this.router.navigate(['/ingresar']);
        });
      } else {
        log.info('Se ha presentado un problema con los datos del usuario, se cierrar la sesión');
        // clear user information
        this.user = this.userService.getEmptyUser();
        this.userService.setUser(JSON.stringify(this.user));
        this.stateSideNav = false;
        observer.error();
        this.router.navigate(['/ingresar']);
      }
    });
  }
}
