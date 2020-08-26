import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ModelFilter } from '../../list-admin/components/filter/filter.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { LoadingService, ModalService, UserLoginService, UserParametersService, Logger } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { BreakpointObserver } from '@angular/cdk/layout';
// import { DownloadListAdminService } from '../../listAdmin-admin/download-listAdmin-modal/download-listAdmin.service';
import { RoutesConst } from '@app/shared';
import { ListAdminService } from '../list-admin.service';

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.scss']
})
export class ListAdminComponent implements OnInit {

  // Componente necesario para el funcionamiento del filtro
  @ViewChild('sidenav') sidenav: MatSidenav;

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

  // Variable en la que se guarda la respuesta del servicio listado de ofertas
  public listAdminOffer: any;

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

  // Domains images
  public domainImages = environment.domainImages;
  applyFilter: boolean;

  /**
   * Creates an instance of ListAdminComponent.
   * @param {ShellComponent} [shellComponent]
   * @param {UserLoginService} [userService]
   * @param {Router} [router]
   * @param {ListAdminService} [listAdminService]
   * @param {UserParametersService} [userParams]
   * @memberof ListAdminComponent
   */

  constructor(
    private searchEventEmitter: EventEmitterSeller,
    private loadingService?: LoadingService,
    private modalService?: ModalService,
    public shellComponent?: ShellComponent,
    public userService?: UserLoginService,
    public router?: Router,
    public listAdminService?: ListAdminService,
    public userParams?: UserParametersService,
    public breakpointObserver?: BreakpointObserver,
  ) {
    this.paramData = new ModelFilter();
    this.layoutChanges = breakpointObserver.observe('(min-width: 577px)');
    this.isEnabled = false;
  }

  /**
   * @method ngOnInit
   * @description Metodo que se llama mientras se inicia el componente
   * @memberof ListAdminComponent
   */
  ngOnInit() {
    // Borra el filtro del localstorage
    localStorage.removeItem('currentFilterListAdmin');

    // Inicializa la instancia de Logger
    this.log = new Logger('ListAdminComponent');

    this.userService.isAuthenticated(this);
    this.layoutChanges.subscribe(result => {
      this.numCols = result.matches ? 1 : 2;
    });

    this.searchSubscription = this.searchEventEmitter.eventSearchSeller.subscribe((seller: any) => {
      this.currentPage = 1;
      this.filterActive = false;
      this.filterRemove = 'all';
      this.isEnabled = true;
      this.seller = seller;
      const PARAMS = {
        IdSeller: seller.IdSeller
      };
      this.getListAdminOffers(PARAMS);
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  /**
   * @method getDataUser
   * @description Metodo para ir al servicio de userParams y obtener los datos del usuario
   * @memberof ListAdminComponent
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
   * @memberof ListAdminComponent
   */
  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.home}`]);
    } else {
      this.getDataUser();
    }
  }

  /**
   * @method getListAdminOffers
   * @description Metodo para consumir el servicio del listado de ofertas
   * @param params
   * @memberof ListAdminComponent
   */
  getListAdminOffers(params?: any) {
    this.loadingService.viewSpinner();
    this.listAdminService.getListAdminOffers(params).subscribe(
      (result: any) => {
        this.viewDetailOffer = false;
        if (result.status === 200 && result.body !== undefined) {
          const response = result.body.data;
          this.numberPages = this.paramData.limit === undefined || this.paramData.limit === null ? response.total / 30 : response.total / this.paramData.limit;
          this.numberPages = Math.ceil(this.numberPages);
          this.listAdminOffer = response.sellerOfferViewModels;
          this.loadingService.closeSpinner();
        } else {
          this.loadingService.closeSpinner();
          this.modalService.showModal('errorService');
        }
      }
    );
  }


  /**
   * Metodo para ver el detalle de la oferta
   *
   * @param {*} item
   * @memberof ListAdminComponent
   */
  openDetailOffer(item: any) {
    this.viewDetailOffer = true;
    this.dataOffer = item;
    this.inDetail = true;
  }

  /**
   * @method filterOffers
   * @description Método para filtrar el listado de ofertas
   * @param {*} params
   * @memberof ListAdminComponent
   */
  filterOffers(params: any) {
    this.currentPage = 1;
    this.filterActive = true;
    this.paramData.IdSeller = this.seller.IdSeller;
    this.paramData.product = params.product !== undefined && params.product !== null ? params.product.trim() : params.product;
    this.paramData.ean = params.ean !== undefined && params.ean !== null ? params.ean.trim() : params.ean;
    this.paramData.pluVtex = params.pluVtex !== undefined && params.pluVtex !== null ? params.pluVtex.trim() : params.pluVtex;
    this.paramData.stock = params.stock;
    this.paramData.sellerSku = params.sellerSku;
    this.paramData.currentPage = this.currentPage;
    this.getListAdminOffers(this.paramData);
    this.sidenav.toggle();
  }

  /**
   * @method removeFilter
   * @param filter
   * @description Método para remover filtros
   * @memberof ListComponent
   */
  removeFilter(filter: any) {
    switch (filter) {
      case 'filterProduct':
        this.paramData.product = undefined;
        break;
      case 'filterEan':
        this.paramData.ean = undefined;
        break;
      case 'filterPluVtex':
        this.paramData.pluVtex = undefined;
        break;
      case 'filterSellerSku':
        this.paramData.sellerSku = undefined;
        break;
      case 'filterStock':
        this.paramData.stock = undefined;
        break;
    }
    this.filterRemove = filter;

    if (this.paramData.product === undefined && this.paramData.ean === undefined && this.paramData.stock === undefined && this.paramData.pluVtex === undefined && this.paramData.sellerSku === undefined) {
      this.filterActive = false;
    }
    this.getListAdminOffers(this.paramData);
  }

  /**
   * @method setDataPaginate
   * @description Metodo para el funcionamiento del páginador
   * @param params
   * @memberof ListAdminComponent
   */
  setDataPaginate(params: any) {
    this.paramData.IdSeller = this.seller.IdSeller;
    this.paramData.currentPage = params === undefined || params.currentPage === undefined ? null : params.currentPage;
    this.paramData.limit = params === undefined || params.limit === undefined ? null : params.limit;
    this.getListAdminOffers(this.paramData);
  }



  /**
   * @method receiveVarConsumeList
   * @description Metodo que recibe un booleano y si es true consume el listado de ofertas.
   * @param {*} event
   * @memberof ListAdminComponent
   */
  receiveVarConsumeList(event: any) {
    if (event && event !== undefined && event !== null) {
      this.listAdminOffer = [];
      this.currentPage = 1;
      this.filterActive = false;
      this.filterRemove = 'all';
      this.paramData.clear();
      this.getListAdminOffers();
    }
  }

  public cleanAllFilter() {
    this.applyFilter = false;
    this.paramData.ean = null;
    this.paramData.stock = null;
    this.paramData.product = null;
    this.paramData.pluVtex = null;
    this.paramData.sellerSku = null;
    this.filterOffers(this.paramData);
    // this.getListOffers(this.paramData);
  }

}
