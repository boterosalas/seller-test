import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { SupportModalComponent } from '@secure/support-modal/support-modal.component';

import { InformationToForm, SearchFormEntity } from '@shared/models/order.model';
import { ComponentsService } from '@shared/services/components.service';
import { EventEmitterOrders } from '@shared/services/eventEmitter-orders.service';

import { LoggedInCallback, UserLoginService, UserParametersService } from '../aws-cognito';
import { Logger } from '../util/logger.service';
import { LoadingService } from '../global';
import { UserInformation } from '@app/shared';
import { SelectLanguageService } from '@app/shared/components/select-language/select-language.service';
import { Subscription } from 'rxjs';
import { StoreService } from '@app/store/store.service';

// log component
const log = new Logger('ShellComponent');

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})

export class ShellComponent implements OnInit, LoggedInCallback, OnDestroy {
  language$: Subscription = new Subscription();
  // Usuario autenticado.
  public user: UserInformation;
  // SideMenu de la aplicación.
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  // Sidenav de búsqueda de órdenes.
  @ViewChild('sidenavSearchOrder', { static: false }) sidenavSearchOrder: MatSidenav;
  // Mostrar header
  showHeader = false;
  stateSideNavOrder = false;
  // booleano para visualizar la barra de toolbar.
  public viewToolbarPrincipal: boolean;

  // Variable que permite saber cual formulario de filtro desplegar
  // en el menú de filtro y que información se le pasar a este mismo.
  informationToForm: SearchFormEntity = {
    title: 'Buscar',
    subtitle: '',
    btn_title: 'Buscar',
    title_for_search: 'Buscar',
    type_form: 'orders',
    information: new InformationToForm,
    count: ''
  };
  userLoggin: boolean;

  idSeller: number;
  typeProfiel: number;
  state: number;
  paginator: any;


  constructor(
    public dialog: MatDialog,
    public componentService: ComponentsService,
    public eventEmitterOrders: EventEmitterOrders,
    private userServiceCognito: UserLoginService,
    private userParams: UserParametersService,
    private loadingService: LoadingService,
    private translate: SelectLanguageService,
  ) { }


  ngOnInit() {
    this.userServiceCognito.isAuthenticated(this);
    this.initLanguage();
  }

  initLanguage() {
    this.setCurrentLanguage();
    this.language$ = this.translate.language$.subscribe(val => {
      let userId = 'current';
      if (localStorage.getItem('userId')) {
        userId = localStorage.getItem('userId');
      }
      if (val) {
        localStorage.setItem('culture_' + userId, val);
        localStorage.setItem('culture_current', val);
      } else {
        localStorage.setItem('culture_' + userId, 'es');
        localStorage.setItem('culture_current', 'es');
      }
    });
  }

  setCurrentLanguage() {
    const currentLanguege = localStorage.getItem('culture_current');
    if (currentLanguege) {
      this.translate.setLanguage(currentLanguege);
    } else {
      this.translate.setLanguage(this.translate.getCurrentLanguage());
    }
  }

  /**
   * @method Método para validar si el usuario esta autenticado.
   * @param message
   * @param isLoggedIn
   * @memberof ShellComponent
   */
  async isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.viewToolbarPrincipal = true;
      this.showHeader = true;
      this.user = await this.userParams.getUserData();
    } else if (!isLoggedIn) {
      this.showHeader = false;
      this.viewToolbarPrincipal = false;
    }
  }

  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof SidebarComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
    this.loadingService.viewProgressBar();
  }

  /**
   * Funcionalidad que permite desplegar el menú de filtro de órdenes.
   * @memberof SidebarComponent
   */
  toggleMenuSearchOrder(informationToForm: SearchFormEntity, idSeller: number, typeProfiel: number, state: number, paginator?: any) {
    this.sidenavSearchOrder.toggle();
    this.informationToForm = informationToForm;
    this.idSeller = idSeller;
    this.typeProfiel = typeProfiel;
    this.state = state;
    this.paginator = paginator;
    log.info('Sidenav Search order menu toggle', `type_form ${informationToForm.type_form}`);
  }

  /**
   * Funcionalidad para desplegar el modal que permite hacer el envío de todos los productos de una orden.
   * @memberof ShellComponent
   */
  openDialogSupport(): void {
    this.loadingService.viewProgressBar();
    const dialogRef = this.dialog.open(SupportModalComponent, {
      width: '90%',
      panelClass: 'full-width-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.closeProgressBar();
    });
  }

  /**
   * Funcionalidad que permite redirigir a Envios Éxito con el acceso de token para poder ingresar automaticamente.
   * @memberof ShellComponent
   */
  goToEnviosExito() {
    const url = `https://envios.exito.com/token/${this.user['access_token']}`;
    window.location.href = url;
    window.open(url);
  }

  ngOnDestroy(): void {
    this.language$.unsubscribe();
  }
}
