// 3rd party components
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
// our own custom components
import { ModelFilter } from '../components/filter/filter.model';
import { ShellComponent } from '@core/shell/shell.component';
import { UserLoginService, UserParametersService, LoadingService, ModalService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { HistoricalService } from '../historical.service';
import { DownloadHistoricalService } from '../download-historical-modal/download-historical.service';
import { Logger } from '@core/util/logger.service';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';


@Component({
  selector: 'app-historical-admin-component',
  templateUrl: './historicalAdmin.component.html',
  styleUrls: ['./historicalAdmin.component.scss']
})

export class HistoricalAdminComponent implements OnInit, OnDestroy {

  // Componente necesario para el funcionamiento del filtro
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  // Variable para almacenar los datos del vendedor que se va a buscar
  public seller: any;

  // Variable para almacenar los datos del usuario
  public user: any;

  // Variable que se usa para ir al componente de detalle de la oferta
  public viewDetailOffer = false;

  // Variable en la que se guardara los datos de la oferta de la cual se esta viendo el detalle
  public dataOffer: any;

  // Variable utilizada para  saber si estas dentro del detalle de la oferta o no
  public inDetail: boolean;

  // Variable para mostrar los filtros aplicados
  public filterActive = false;

  // Variable donde se almacenan los parametros que se le envian al servicio de listado de ofertas para filtrar o paginar
  public paramData: ModelFilter;

  // Variable que se usa para controlar que filtro se esta removiendo
  public filterRemove: any;

  // Variable en la que se guarda la respuesta del servicio historico de ofertas
  public historicalOffer: any;

  // Variable en la que se almacena cuantas páginas trae el servicio de listado de ofertas
  public numberPages: any;

  // Variable que se le envia al toolbar para volver a ponerlo en la página 1
  public currentPage: any;

  // Variable que almacena el paginationToken de cada petición
  public paginationToken: Array<string>;

  // Variable que se usa para escuchar los cambios en el layout
  public layoutChanges: any;

  // Variable que contiene el numero de columnas que ocuparan el grid-list
  public numCols: number;

  // Variable que contiene el limite de registros por petición
  public limit: number;

  // Instancia de Logger
  public log: Logger;

  // Search subscription
  private searchSubscription: any;

  // Filter enabled
  public isEnabled: boolean;

  /**
   * Creates an instance of HistoricalComponent.
   * @param {ShellComponent} [shellComponent]
   * @param {UserLoginService} [userService]
   * @param {Router} [router]
   * @param {HistoricalService} [historicalService]
   * @param {UserParametersService} [userParams]
   * @memberof HistoricalComponent
   */

  constructor(
    private searchEventEmitter: EventEmitterSeller,
    private loadingService?: LoadingService,
    private modalService?: ModalService,
    public shellComponent?: ShellComponent,
    public userService?: UserLoginService,
    public router?: Router,
    public historicalService?: HistoricalService,
    public userParams?: UserParametersService,
    public breakpointObserver?: BreakpointObserver,
    public downloadHistoricalService?: DownloadHistoricalService,
  ) {
    this.paramData = new ModelFilter();
    this.layoutChanges = breakpointObserver.observe('(min-width: 577px)');
  }

  /**
   * @method ngOnInit
   * @description Metodo que se llama mientras se inicia el componente
   * @memberof HistoricalComponent
   */
  ngOnInit() {
    // Borra el filtro del localstorage
    localStorage.removeItem('currentFilterHistorical');
    // Inicializa el valor del limite
    this.limit = 100;
    // Inicializa el array de paginationToken
    this.paginationToken = [];
    // Llena la primeara posición del paginationToken con null
    this.paginationToken.push('null');
    // Inicializa la instancia de Logger
    this.log = new Logger('HistoricalComponent');

    this.userService.isAuthenticated(this);
    this.layoutChanges.subscribe(result => {
      this.numCols = result.matches ? 1 : 2;
    });

    this.searchSubscription = this.searchEventEmitter.eventSearchSeller.subscribe((seller: any) => {
      this.seller = seller;
      const PARAMS = {
        IdSeller: seller.IdSeller
      };
      this.getHistoricalOffers(PARAMS);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  /**
   * @method getDataUser
   * @description Metodo para ir al servicio de userParams y obtener los datos del usuario
   * @memberof HistoricalComponent
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${RoutesConst.home}`]);
    }
  }

  /**
   * @method isLoggedIn
   * @description Metodo para validar si el usuario esta logeado
   * @param message
   * @param isLoggedIn
   * @memberof HistoricalComponent
   */
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    } else {
      this.getDataUser();
    }
  }

  /**
   * @method getHistoricalOffers
   * @description Metodo para consumir el servicio del historico de ofertas
   * @param params
   * @memberof HistoricalComponent
   */
  getHistoricalOffers(params?: any, isPageChangue?: boolean) {
    this.loadingService.viewSpinner();
    this.historicalService.getHistoricalOffers(params).subscribe(
      (result: any) => {
        if (result.status === 200 && result.body !== undefined) {

          const response = result.body ? result.body.data : null;

          // Pregunta si la respuesta tiene resultados
          if (response) {
            this.isEnabled = true;

            // Pregunta si ya hay datos en la variable historicalOffer
            if (this.historicalOffer && isPageChangue) {
              if (response.paginationToken !== '{}') {
                this.paginationToken.push(response.paginationToken);
              }
              this.historicalService.savePaginationTokens(this.paginationToken);
              this.historicalOffer = response.offerHistoricals;
              // Entra cuando no hay datos en la variable historicalOffer
            } else {
              // Obtiene los valores iniciales de la primera consulta para poner datos en la variable historicalOffer
              this.numberPages = this.paramData.limit === undefined || this.paramData.limit === null ? response.total / this.limit : response.total / this.paramData.limit;
              this.numberPages = Math.ceil(this.numberPages);
              this.downloadHistoricalService.setCurrentFilterHistorical(this.paramData.dateInitial, this.paramData.dateFinal, this.paramData.ean, params.IdSeller);
              if (response.paginationToken !== '{}') {
                this.paginationToken.push(response.paginationToken);
              }
              this.historicalService.savePaginationTokens(this.paginationToken);
              this.historicalOffer = response.offerHistoricals;
            }
            // Entra cuando la respuesta no tiene resultados
          } else {
            // Pone en false la variable historicalOffer y resetea los valores del páginador
            this.historicalOffer = false;
            this.numberPages = 0;
            this.currentPage = 0;
            this.isEnabled = false;
          }
          this.loadingService.closeSpinner();
          this.log.debug(response);
        } else {
          this.loadingService.closeSpinner();
          this.modalService.showModal('errorService');
          this.isEnabled = false;
        }
      }
    );
  }

  /**
   * @method historicalFilter
   * @param params
   * @description Metodo para filtrar el historico de ofertas
   * @memberof HistoricalComponent
   */
  historicalFilter(params: any) {
    this.historicalOffer = false;
    this.currentPage = 1;
    this.filterActive = true;
    this.paramData.dateInitial = params.get('dateInitial').value;
    this.paramData.dateFinal = params.get('dateFinal').value;
    this.paramData.ean = params.get('ean').value !== undefined && params.get('ean').value !== null ? params.get('ean').value.trim() : params.get('ean').value;
    // this.paramData.currentPage = this.currentPage;
    this.paramData.limit = this.limit;
    this.paramData.IdSeller = this.seller.IdSeller;
    this.getHistoricalOffers(this.paramData);
    this.downloadHistoricalService.setCurrentFilterHistorical(this.paramData.dateInitial, this.paramData.dateFinal, this.paramData.ean, this.paramData.IdSeller); // Metodo para guardadr los parametros del filtro

    this.paginationToken = []; // Clear paginationToken variable
    this.paginationToken.push('null');
    this.historicalService.savePaginationTokens(this.paginationToken);
    this.numberPages = 0; // Clear paginator

    this.sidenav.toggle();
  }

  /**
   * @method setDataPaginate
   * @description Metodo para el funcionamiento del páginador
   * @param params
   * @memberof HistoricalComponent
   */
  setDataPaginate(params: any) {
    this.paramData.IdSeller = this.seller.IdSeller;
    this.paramData.currentPage = params === undefined || params.currentPage === undefined ? null : params.currentPage;
    this.paramData.limit = params === undefined || params.limit === undefined ? null : params.limit;
    this.getHistoricalOffers(this.paramData, true);
  }

  /**
   * @method removeLastPaginationToken
   * @description Metodo eliminar el ultimo pagination Token
   * @param currentPage
   * @memberof HistoricalComponent
   */
  removeLastPaginationToken(currentPage: number) {
    if (currentPage === this.paginationToken.length) {
      this.paginationToken.pop();
    } else {
      this.paginationToken.pop();
      this.paginationToken.pop();
    }
    this.historicalService.savePaginationTokens(this.paginationToken);
  }

}
